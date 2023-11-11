import { Router } from 'express';
import * as RestaurantHandlers from './restaurant.handlers';

const router = Router();

router.get('/init', RestaurantHandlers.initGlovo);

export default router;
