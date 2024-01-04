import express from 'express';

import roomRoutes from './room/room.routes';
import restaurantRoutes from './restaurant/restaurant.routes';
import { testingRouter } from './testing.routes';

const router = express.Router();

router.use(testingRouter);
router.use('/rooms', roomRoutes);
router.use(restaurantRoutes);

export default router;
