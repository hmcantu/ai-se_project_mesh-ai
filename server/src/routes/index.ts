import { Router } from 'express';
import authRouter from './auth.js';
import chatRoutes from './chatRoutes.js';
import documentRoutes from './documentRoutes.js';
import queryRoutes from './queryRoutes.js';
import usersRouter from './users.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/chats', chatRoutes);
router.use('/documents', documentRoutes);
router.use('/query', queryRoutes);
router.use('/users', usersRouter);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'healthy' },
    error: null
  });
});

export default router;