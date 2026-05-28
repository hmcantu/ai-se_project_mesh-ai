import { Router } from 'express';
import * as chatCtrl from '../controllers/chats.js';
import { auth } from '../middleware/auth.js'; 

const router = Router();

router.use(auth);

router.post('/', chatCtrl.createChat);
router.get('/', chatCtrl.getChats);
router.get('/:id', chatCtrl.getChatById);
router.patch('/:id', chatCtrl.updateChat);
router.delete('/:id', chatCtrl.deleteChat);
router.post('/:id/messages', chatCtrl.sendMessage);

export default router;