import { z } from 'zod';

export const joinRoomBodySchema = z.object({
  userId: z.string(),
});

export const joinRoomSchema = z.object({
  roomId: z.number().int(),
  userId: z.string(),
});

export const createRoomSchema = z.object({
  userId: z.string(),
  location: z.string(),
});

export const roomIdSchema = z.object({
  roomId: z.number().min(1),
});

export const userIdSchema = z.object({
  userId: z.string(),
});

export type RoomId = z.input<typeof roomIdSchema>;
export type JoinRoomBody = z.infer<typeof joinRoomBodySchema>;
export type JoinRoom = z.infer<typeof joinRoomSchema>;
export type CreateRoom = z.infer<typeof createRoomSchema>;
