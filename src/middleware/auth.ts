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
      // 🎯 Standardized failure response shape
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

    // Read secret directly, and cast using an object shape instead of 'any'
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (_err) { // 🎯 Prefixing with an underscore keeps empty catch statements from throwing style errors
    res.status(401).json({ 
      success: false,
      data: null,
      error: { message: 'Unauthorized. Invalid or expired token.' }
    });
  }
};