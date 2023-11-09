import { Restaurant } from '@prisma/client';
import prisma from '../prisma';
import { generateGlovoHeaders } from './restaurantUtils';
import { shuffleArray } from '../utils';

function generateImageUrl(imageId: string): string {
  return `https://res.cloudinary.com/glovoapp/q_30,f_auto,c_fill,dpr_1.0,h_1800,w_800,b_transparent/${imageId}`;
}

function extractRestaurantData(storeData: any) {
  const rating = storeData.ratingInfo.cardLabel;
  const restaurant: Restaurant = {
    id: storeData.id.toString(),
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

export async function getRestaurantsFromGlovo() {
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

export async function getRestaurantsForCity(
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
