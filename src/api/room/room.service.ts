import { BadRequestError, NotFoundError } from '../../exceptions/appError';
import prisma from '../../prisma';
import { CreateRoom, JoinRoom } from './room.schemas';

async function create(createRoom: CreateRoom) {
  const res = await prisma.room.create({
    data: {
      size: 1,
      location: createRoom.location,
      started: false,
      users: {
        connectOrCreate: {
          where: { id: createRoom.userId },
          create: { id: createRoom.userId },
        },
      },
    },
  });
  const joinRoomUrl = `/rooms/${res.id}/join`;
  const createRoomResponse = { ...res, joinRoomUrl };

  console.log(createRoomResponse);
  return createRoomResponse;
}

async function getRoom(roomId: number) {
  const room = await prisma.room.findFirst({
    where: { id: roomId },
    include: { users: true },
  });

  if (!room) {
    throw new NotFoundError(`Room with id:${roomId} not found`);
  }

  if (room.started === true) {
    throw new BadRequestError(`Room with id:${roomId} already started`);
  }

  console.log(room);
  return room;
}
async function getRoomForUser(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { room: true },
  });

  console.log(user);
  return user;
}

async function join(joinRoom: JoinRoom) {
  const roomExists = await getRoom(joinRoom.roomId);

  if (roomExists?.users.some((user) => user.id === joinRoom.userId)) {
    const { users, ...room } = roomExists;
    return room;
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

  if (!room) {
    throw new NotFoundError(`Room not found`);
  }

  if (room.started === true) {
    throw new BadRequestError(`Room already started`);
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
  getRoom,
  getRoomForUser,
  join,
  leave,
  start,
};
