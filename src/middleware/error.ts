import type { Request, Response, NextFunction } from 'express';

// 1. The "Route Not Found" (404) Handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    data: null,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

// 2. The Server Error (500) Handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    data: null,
    error: 'An error has occurred on the server',
  });
};