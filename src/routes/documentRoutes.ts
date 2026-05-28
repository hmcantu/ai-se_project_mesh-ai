import { Router } from 'express';
import * as docCtrl from '../controllers/documents.js';
// 1. Import the middleware
import { auth } from '../middleware/auth.js';

const router = Router();

// 2. Protect all document routes
router.use(auth);

router.post('/', docCtrl.uploadDocument);
router.get('/', docCtrl.getDocuments);
router.get('/:id', docCtrl.getDocumentById);
router.patch('/:id', docCtrl.updateDocument);
router.delete('/:id', docCtrl.deleteDocument);
router.post('/:id/ingest', docCtrl.ingestDocument);

export default router;