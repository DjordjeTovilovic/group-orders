import express, { Request, Response, Application } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { eventsHandler, sendEventToRoomMembers } from './eventsUtils';
import restaurantService from './api/restaurant/restaurant.service';
import { errorMiddleware } from './middlewares';
import routes from './api/routes';

dotenv.config();
const app: Application = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/cities/:cityCode/:page', async (req: Request, res: Response) => {
  const restaurants = await restaurantService.getRestaurantsForCity(
    req.params.cityCode,
    +req.params.page
  );

  res.json(restaurants);
});

app.post('/rooms/333', (req: Request, res: Response) => {
  console.log(req.body);

  res.sendStatus(200);
});

app.get('/rooms/:roomId/events', eventsHandler);

async function addFact(request: Request, response: Response) {
  const newFact = request.body;

  response.json(newFact);
  return sendEventToRoomMembers(2, newFact);
}

app.post('/fact', addFact);

app.use(routes);

app.use(errorMiddleware);

export default app;
