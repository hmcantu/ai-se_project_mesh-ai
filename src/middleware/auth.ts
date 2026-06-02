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
      res.status(401).json({ 
        success: false,
        data: null,
        error: { message: 'Unauthorized. Missing or invalid token format.' }
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ 
        success: false,
        data: null,
        error: { message: 'Unauthorized. Token missing from authorization header.' }
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as Record<string, unknown>;

    req.user = {
      userId: String(decoded['userId'] || ''),
    };

    next();
  } catch { 
    res.status(401).json({ 
      success: false,
      data: null,
      error: { message: 'Unauthorized. Invalid or expired token.' }
    });
  }
};