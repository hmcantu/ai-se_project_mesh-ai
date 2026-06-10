import { Router } from 'express';
import * as chatCtrl from '../controllers/chats.js';
import { createMessage } from '../controllers/messages.js'; // Import the new controller
import { auth } from '../middleware/auth.js';

const router = Router();

// Protect all chat routes
router.use(auth);

router.post('/', chatCtrl.createChat);
router.get('/', chatCtrl.getChats);
router.get('/:id', chatCtrl.getChatById); // This handles GET /chats/:id and returns chat + history
router.patch('/:id', chatCtrl.updateChat);
router.delete('/:id', chatCtrl.deleteChat);
router.post('/:id/messages', createMessage); // Updated to use your live message persistence handler

export default router;