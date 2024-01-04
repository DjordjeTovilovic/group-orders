import { Router } from 'express';
import { Request, Response } from 'express';
import restaurantService from './restaurant/restaurant.service';
import { sendEventToRoomMembers, eventsHandler } from '../eventsUtils';

const router = Router();

router.get('/cities/:cityCode/:page', async (req: Request, res: Response) => {
  const restaurants = await restaurantService.getRestaurantsForCity(
    req.params.cityCode,
    +req.params.page
  );

  res.json(restaurants);
});

router.post('/rooms/333', (req: Request, res: Response) => {
  console.log(req.body);

  res.sendStatus(200);
});

router.get('/rooms/:roomId/events', eventsHandler);

async function addFact(request: Request, response: Response) {
  const newFact = request.body;

  response.json(newFact);
  return sendEventToRoomMembers(2, newFact);
}

router.post('/fact', addFact);

export { router as testingRouter };
