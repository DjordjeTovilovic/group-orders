import { Restaurant } from '@prisma/client';
import prisma from '../prisma';
import { generateGlovoHeaders } from './restaurantUtils';

function generateImageUrl(imageId: string): string {
  return `https://res.cloudinary.com/glovoapp/q_30,f_auto,c_fill,dpr_1.0,h_156,w_351,b_transparent/${imageId}`;
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
  const restaurants: any = [];

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

  const res = await prisma.restaurant.createMany({ data: restaurants });
  console.log(res);

  return restaurants;
}
