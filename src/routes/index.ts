import { Router } from 'express';
import { authRouter } from './auth.js';
import chatRoutes from './chatRoutes.js';
import documentRoutes from './documentRoutes.js';
import queryRoutes from './queryRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/chats', chatRoutes);
router.use('/documents', documentRoutes);
router.use('/query', queryRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, error: null });
});

export default router;