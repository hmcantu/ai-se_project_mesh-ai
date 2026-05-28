import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. Missing or invalid token format.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Read secret directly, and cast using an object shape instead of 'any'
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch { // 💡 Look, no variable name at all! Completely legal and ultra-clean.
    res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};