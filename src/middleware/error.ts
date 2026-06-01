import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);
  
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message: err.message || 'An unexpected error occurred on the server.'
    }
  });
};