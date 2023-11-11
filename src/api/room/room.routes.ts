import { Router } from 'express';
import * as RoomHandlers from './room.handlers';

const router = Router();

router.post('', RoomHandlers.createRoom);
router.post('/:roomId/join', RoomHandlers.joinRoom);
router.post('/:roomId/leave', RoomHandlers.leaveRoom);
router.post('/:roomId/start', RoomHandlers.startRoom);
router.post('/:roomId/like', RoomHandlers.like);

export default router;
