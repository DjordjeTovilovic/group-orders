import { Prisma, User } from '@prisma/client';
import prisma from '../prisma';

export async function createRoom(
  room: Prisma.RoomCreateInput,
  userId: User['id'] | undefined
) {
  let res;
  if (!userId) {
    res = await prisma.room.create({
      data: {
        size: +room.size,
        cityCode: room.cityCode,
        users: { create: {} },
      },
    });
    console.log(res);
  } else {
    res = await prisma.room.create({
      data: { size: +room.size, cityCode: room.cityCode },
    });
  }
  return res;
}
