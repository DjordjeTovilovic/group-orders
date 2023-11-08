import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import {
  getRestaurantsForCity,
  getRestaurantsFromGlovo,
} from './restaurant/restaurantService';
import morgan from 'morgan';
import cors from 'cors';
import { createRoom } from './room/roomService';
import { likeRestaurant } from './like/likeService';
import { eventsHandler, sendEventToRoomMembers } from './eventsUtils';
import { Like } from '@prisma/client';

dotenv.config();
const app: Application = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

app.get('/init', async (req: Request, res: Response) => {
  const restaurants = await getRestaurantsFromGlovo();

  // console.log(restaurants.length);
  res.json(restaurants);
});

app.post('/rooms', async (req: Request, res: Response) => {
  const room = await createRoom(req.body, undefined);

  res.json(room);
});

app.get('/cities/:cityCode/:page', async (req: Request, res: Response) => {
  const restaurants = await getRestaurantsForCity(
    req.params.cityCode,
    +req.params.page
  );

  res.json(restaurants);
});

app.post('/rooms/:roomId/like', async (req: Request, res: Response) => {
  const restaurant: Like = {
    roomId: +req.params.roomId,
    userId: +req.body.userId,
    restaurantId: req.body.restaurantId,
  };
  await likeRestaurant(restaurant);

  res.sendStatus(201);
});

app.post('/rooms/333', (req: Request, res: Response) => {
  console.log(req.body);

  res.sendStatus(200);
});

app.get('/rooms/:roomId/events', eventsHandler);

async function addFact(request: Request, response: Response) {
  const newFact = request.body;
  // facts.push(newFact);
  response.json(newFact);
  return sendEventToRoomMembers(2, newFact);
}

app.post('/fact', addFact);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
