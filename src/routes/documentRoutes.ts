import { Router } from 'express';
import * as docCtrl from '../controllers/documents.js';

const router = Router();

router.post('/', docCtrl.uploadDocument);
router.get('/', docCtrl.getDocuments);
router.delete('/:id', docCtrl.deleteDocument);

export default router;