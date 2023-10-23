import prisma from '../prisma';
import { Room } from '@prisma/client';
import { sendEventToRoomMembers } from '../eventsUtils';

export async function likeRestaurant(payload: any) {
  const like = await prisma.like.create({
    data: {
      restaurantId: payload.restaurantId,
      roomId: +payload.roomId,
      userId: +payload.userId,
    },
    include: { room: true },
  });
  console.log(like);

  isWinningRestaurantFound(like.room);
}

export async function isWinningRestaurantFound(room: Room) {
  const likes = await prisma.like.findMany({ where: { roomId: room.id } });
  const hash: Record<string, number> = {};

  likes.forEach(async (like) => {
    const restaurantId = like.restaurantId;
    hash[restaurantId] = hash[restaurantId] + 1 || 1;
    if (hash[restaurantId] === room.size) {
      const winingRestaurant = await prisma.restaurant.findFirstOrThrow({
        where: { id: restaurantId },
      });
      sendEventToRoomMembers(room.id, winingRestaurant);
    }
  });
  console.log(likes);
}
