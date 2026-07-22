import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', auth, getCurrentUser); 

export default router;