import type { NextFunction, Request, Response } from 'express';
import { HttpException, JsonResponse } from '../utils/index';

function errorHandlerMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number;
  let message: string;
  if (error instanceof HttpException) {
    ({ status, message } = error);
  } else {
    status = 500;
    message = error?.message ?? 'Something went wrong';
  }

  res.status(status).json(new JsonResponse(message));
}

export default errorHandlerMiddleware;
