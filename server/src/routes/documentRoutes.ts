import { Router } from 'express';
import multer from 'multer';
import * as docCtrl from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Protect all document routes
router.use(auth);

// Configure Multer to stage files in the uploads/ directory
const upload = multer({ dest: 'uploads/' });

// Pass the upload middleware before executing your controller
router.post('/', upload.single('file'), docCtrl.uploadDocument);

router.get('/', docCtrl.getDocuments);
router.get('/:id', docCtrl.getDocumentById);
router.patch('/:id', docCtrl.updateDocument);
router.delete('/:id', docCtrl.deleteDocument);
router.post('/:id/ingest', docCtrl.ingestDocument);

export default router;