import { Restaurant } from '@prisma/client';
import prisma from '../../prisma';
import { generateGlovoHeaders } from './restaurant.utils';
import { shuffleArray } from '../../utils';
import { sendEventToRoomMembers } from '../../eventsUtils';
import { Like, Room } from '@prisma/client';

function generateImageUrl(imageUrl: string): string {
  const imageId = imageUrl.split('/').at(-1);
  return `https://images.deliveryhero.io/image/stores-glovo/stores/${imageId}?t=W3siYXV0byI6eyJxIjoibG93In19LHsicmVzaXplIjp7Im1vZGUiOiJmaWxsIiwiYmciOiJ0cmFuc3BhcmVudCIsIndpZHRoIjo1ODgsImhlaWdodCI6MzIwfX1d`;
}

function extractRestaurantData(storeData: any) {
  const rating = storeData.ratingInfo.cardLabel;
  const restaurant: Restaurant = {
    id: storeData.id,
    name: storeData.name,
    cityCode: storeData.cityCode,
    imageUrl: generateImageUrl(storeData.imageId),
    deliveryFee: storeData.serviceFee,
    open: storeData.open,
    rating: rating !== '--' ? rating : null,
    ratingCount: storeData.ratingInfo.totalRatingLabel,
  };

  return restaurant;
}

async function getRestaurantsFromGlovo() {
  const headers = generateGlovoHeaders();
  const request = await fetch(
    'https://api.glovoapp.com/v3/feeds/categories/1?limit=351&offset=0',
    { method: 'GET', headers: headers }
  );

  const response = await request.json();
  const restaurants: Restaurant[] = [];

  response.elements.forEach((element: any) => {
    if (element?.singleData?.type === 'STORE') {
      const storeData = element.singleData.storeData.store;
      console.log(storeData);

      const restaurant = extractRestaurantData(storeData);
      restaurants.push(restaurant);
    }
  });

  await prisma.restaurant.deleteMany({
    where: { cityCode: restaurants[0].cityCode },
  });

  await prisma.restaurant.createMany({ data: restaurants });

  return restaurants;
}

async function getRestaurantsForCity(
  cityCode: Restaurant['cityCode'],
  pagination: number
) {
  const take = 50;
  const restaurants = await prisma.restaurant.findMany({
    where: { cityCode: cityCode.toUpperCase(), open: true },
    skip: pagination * take,
    take,
  });

  shuffleArray(restaurants);
  return restaurants;
}

async function like(payload: Like) {
  const like = await prisma.like.create({
    data: payload,
    include: { room: true },
  });
  console.log(like);

  isWinningRestaurantFound(like.room);
}

async function isWinningRestaurantFound(room: Room) {
  const likes = await prisma.like.findMany({ where: { roomId: room.id } });
  const hash: Record<string, number> = {};

  likes.forEach(async (like) => {
    const restaurantId = like.restaurantId;
    hash[restaurantId] = hash[restaurantId] + 1 || 1;
    if (hash[restaurantId] >= room.size) {
      const winingRestaurant = await prisma.restaurant.findFirstOrThrow({
        where: { id: restaurantId },
      });
      sendEventToRoomMembers(room.id, winingRestaurant);
    }
  });
  console.log(likes);
}

export default {
  getRestaurantsFromGlovo,
  getRestaurantsForCity,
  like,
};
