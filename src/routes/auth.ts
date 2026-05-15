import { Router } from 'express';
import { getCurrentUser } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);

export { authRouter };
