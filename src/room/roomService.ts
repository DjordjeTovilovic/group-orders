// import { Prisma } from '@prisma/client';
import prisma from '../prisma';

export async function createRoom(size: number, userId: number | undefined) {
  // prisma.user.findFirst({ where: { id: userId } });
  let res;
  if (!userId) {
    res = await prisma.room.create({ data: { size, users: { create: {} } } });
    console.log(res);
  } else {
    res = await prisma.room.create({ data: { size } });
  }
  return res;
}
