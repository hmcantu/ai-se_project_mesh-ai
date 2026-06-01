import type { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`[LOG] ${req.method} ${req.path}`);
  next();
};