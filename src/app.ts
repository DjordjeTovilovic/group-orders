import express, { Request, Response, Application, NextFunction } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import roomService from './room/roomService';
import { eventsHandler, sendEventToRoomMembers } from './eventsUtils';
import { Like } from '@prisma/client';
import { errorHandler } from './exceptions/errorHandler';
import restaurantService from './restaurant/restaurantService';

dotenv.config();
const app: Application = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

app.get('/init', async (req: Request, res: Response) => {
  const restaurants = await restaurantService.getRestaurantsFromGlovo();

  res.json(restaurants);
});

app.get('/cities/:cityCode/:page', async (req: Request, res: Response) => {
  const restaurants = await restaurantService.getRestaurantsForCity(
    req.params.cityCode,
    +req.params.page
  );

  res.json(restaurants);
});

app.post('/rooms', async (req: Request, res: Response) => {
  const room = await roomService.create(req.body);

  res.json(room);
});

app.post('/rooms/:roomId/join', async (req: Request, res: Response) => {
  const room = await roomService.join({
    userId: req.body.userId,
    roomId: +req.params.roomId,
  });

  res.json(room);
});

app.post('/rooms/:roomId/leave', async (req: Request, res: Response) => {
  const room = await roomService.leave(req.body.userId);

  res.json(room);
});

app.post('/rooms/:roomId/start', async (req: Request, res: Response) => {
  const room = await roomService.start(+req.params.roomId);

  res.json(room);
});

app.post('/rooms/:roomId/like', async (req: Request, res: Response) => {
  const restaurant: Like = {
    roomId: +req.params.roomId,
    userId: req.body.userId,
    restaurantId: +req.body.restaurantId,
  };
  await restaurantService.like(restaurant);

  res.sendStatus(201);
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res);
});

app.listen(port, () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
