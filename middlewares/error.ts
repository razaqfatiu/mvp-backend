import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface StatusError extends Error {
  status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(
    `${req.method} ${req.originalUrl} not found`
  ) as StatusError;
  error.status = 404;
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err: StatusError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Something went wrong' });
  next();
};
