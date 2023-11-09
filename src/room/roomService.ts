import { CreateRoom, JoinRoom } from '../common/types';
import prisma from '../prisma';

async function create(createRoom: CreateRoom) {
  const res = await prisma.room.create({
    data: {
      size: 1,
      cityCode: createRoom.cityCode,
      started: false,
      users: {
        connectOrCreate: {
          where: { id: createRoom.userId },
          create: { id: createRoom.userId },
        },
      },
    },
  });
  console.log(res);
  return res;
}

async function join(joinRoom: JoinRoom) {
  const roomExists = await prisma.room.findFirst({
    where: { id: joinRoom.roomId },
    include: { users: true },
  });
  if (
    !roomExists ||
    roomExists?.started === true ||
    roomExists?.users.some((user) => user.id === joinRoom.userId)
  ) {
    return null;
  }

  const res = await prisma.room.update({
    where: { id: joinRoom.roomId },
    data: {
      size: { increment: 1 },
      users: {
        connectOrCreate: {
          where: { id: joinRoom.userId },
          create: { id: joinRoom.userId },
        },
      },
    },
  });

  return res;
}

async function leave(userId: string) {
  const res = await prisma.user.update({
    where: { id: userId },
    data: {
      room: { disconnect: true },
    },
  });

  return res;
}

async function start(roomId: number) {
  const room = await prisma.room.findFirst({
    where: { id: roomId },
    include: { _count: { select: { users: true } } },
  });

  if (!room || room.started === true) {
    return null;
  }

  const res = await prisma.room.update({
    where: { id: roomId },
    data: {
      started: true,
      size: room._count.users,
    },
  });

  return res;
}

export default {
  create,
  join,
  leave,
  start,
};
