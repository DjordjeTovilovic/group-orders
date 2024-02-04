import { Like, Room } from '@prisma/client';
import { Request, Response } from 'express';
import roomService from './room.service';
import restaurantService from '../restaurant/restaurant.service';
import { JoinRoomBody } from './room.schemas';

export async function createRoom(req: Request, res: Response<Room>) {
  const room = await roomService.create(req.body);

  res.json(room);
}

export async function getRoom(
  req: Request<{ roomId: string }, Room, {}>,
  res: Response<Room>
) {
  const roomId = +req.params.roomId;
  const room = await roomService.getRoom(roomId);

  res.json(room);
}

export async function getRoomForUser(
  req: Request<{ userId: string }, {}, {}>,
  res: Response
) {
  const userId = req.params.userId;
  const room = await roomService.getRoomForUser(userId);

  res.json(room);
}

export async function joinRoom(
  req: Request<{ roomId: string }, Room, JoinRoomBody>,
  res: Response<Room>
) {
  const room = await roomService.join({
    userId: req.body.userId,
    roomId: +req.params.roomId,
  });

  res.json(room);
}

export async function leaveRoom(req: Request, res: Response) {
  await roomService.leave(req.body.userId);

  res.sendStatus(200);
}

export async function startRoom(req: Request, res: Response) {
  await roomService.start(+req.params.roomId);

  res.sendStatus(200);
}

export async function like(req: Request, res: Response) {
  const restaurant: Like = {
    roomId: +req.params.roomId,
    userId: req.body.userId,
    restaurantId: +req.body.restaurantId,
  };
  await restaurantService.like(restaurant);

  res.sendStatus(201);
}

export async function getRestaurants(req: Request, res: Response) {
  const restaurants = await restaurantService.getRestaurantsForCity(
    req.params.cityCode,
    +req.params.page
  );

  res.json(restaurants);
}
