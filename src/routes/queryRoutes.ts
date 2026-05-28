import { Router } from 'express';
import { askQuestion } from '../controllers/query.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.post('/', askQuestion);

export default router;