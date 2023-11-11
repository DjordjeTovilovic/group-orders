import { Restaurant } from '@prisma/client';
import { Request, Response } from 'express';
import restaurantService from './restaurant.service';

export async function initGlovo(req: Request, res: Response) {
  const restaurants = await restaurantService.getRestaurantsFromGlovo();

  res.json(restaurants);
}
