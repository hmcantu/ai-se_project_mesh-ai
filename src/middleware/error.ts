import type { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
    },
  });
};


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {

  console.error(err.stack);

 
  res.status(500).json({
    success: false,
    data: null,
    error: {
      message: 'Internal Server Error',
    },
  });
};