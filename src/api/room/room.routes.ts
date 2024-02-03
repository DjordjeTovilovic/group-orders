import { Router } from 'express';
import * as RoomHandlers from './room.handlers';
import { createRoomSchema, joinRoomBodySchema } from './room.schemas';
import { validateRequest } from 'zod-express-middleware';

const router = Router();

router.get('/:roomId', RoomHandlers.getRoom);
router.post(
  '/',
  validateRequest({ body: createRoomSchema }),
  RoomHandlers.createRoom
);
router.post(
  '/:roomId/join',
  validateRequest({ body: joinRoomBodySchema }),
  RoomHandlers.joinRoom
);
router.post('/:roomId/leave', RoomHandlers.leaveRoom);
router.post('/:roomId/start', RoomHandlers.startRoom);
router.post('/:roomId/like', RoomHandlers.like);

export default router;
