import express from 'express';

import roomRoutes from './room/room.routes';
import restaurantRoutes from './restaurant/restaurant.routes';

const router = express.Router();

router.use('/rooms', roomRoutes);
router.use(restaurantRoutes);

export default router;
