import { Router } from 'express';
import * as docCtrl from '../controllers/documents.js';

const router = Router();

router.post('/', docCtrl.uploadDocument);
router.get('/', docCtrl.getDocuments);
router.get('/:id', docCtrl.getDocumentById);
router.patch('/:id', docCtrl.updateDocument);
router.delete('/:id', docCtrl.deleteDocument);
router.post('/:id/ingest', docCtrl.ingestDocument);

export default router;