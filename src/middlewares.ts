import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './exceptions/errorHandler';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  errorHandler.handleError(err, res);
}
