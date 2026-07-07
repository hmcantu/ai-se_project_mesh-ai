import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }
  return process.env.JWT_SECRET;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ 
        success: false,
        data: null,
        error: { message: 'Email, password, and name are required.' }
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ 
        success: false,
        data: null,
        error: { message: 'Password must be at least 8 characters long.' }
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ 
        success: false,
        data: null,
        error: { message: 'A user with this email already exists.' }
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        data: null,
        error: { message: 'Email and password are required.' }
      });
      return;
    }

    const invalidCredentialsMessage = 'Invalid email or password.';

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ 
        success: false,
        data: null,
        error: { message: invalidCredentialsMessage }
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false,
        data: null,
        error: { message: invalidCredentialsMessage }
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ 
        success: false,
        data: null,
        error: { message: 'Unauthorized.' }
      });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      res.status(404).json({ 
        success: false,
        data: null,
        error: { message: 'User not found.' }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    _next(error);
  }
};