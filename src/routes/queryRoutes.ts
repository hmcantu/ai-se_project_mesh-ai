import { Router } from 'express';
import { askQuestion } from '../controllers/query.js';

const router = Router();

router.post('/', askQuestion);

export default router;