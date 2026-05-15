import { Router } from 'express';
import { authRouter } from './auth.js';

const router = Router();

router.use('/auth', authRouter);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

export default router;