import rateLimit from 'express-rate-limit';

const isProduction = process.env.NODE_ENV === 'production';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skip: () => !isProduction, // Disable when not in production
  message: {
    success: false,
    data: null,
    error: { message: 'Too many login attempts. Please try again later.' },
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 register requests per hour
  skip: () => !isProduction, // Disable when not in production
  message: {
    success: false,
    data: null,
    error: { message: 'Too many accounts created from this IP. Please try again later.' },
  },
});