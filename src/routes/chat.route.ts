import { Router } from 'express';
import { ChatsController } from '../controllers/chatController';

const chatsController = new ChatsController();
const router = Router();

router.get('/unread-messages/:chatId', chatsController.getNumberOfUnreadMessages);
router.get('/my-chats', chatsController.getChatsByUserId);
router.post('/', chatsController.createChat);
router.get('/:chatId', chatsController.getChatById);
router.delete('/:chatId', chatsController.deleteChat);

router.post('/messages', chatsController.createMessage);
router.put('/messages/:messageId', chatsController.updateMessage);
router.get('/messages/unread-and-last/:chatId', chatsController.getUnreadAndLastMessagesAsync);
router.delete('/messages/:messageId', chatsController.deleteMessage);
router.get('/messages/:chatId', chatsController.getFirst30MessagesByChatId);

export default router;
