import type { Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      message: `Route NOT Found - Method [${req.method}] on path [${req.path}]`
    }
  });
};

export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response
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