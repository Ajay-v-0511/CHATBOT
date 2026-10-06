const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');

// Support both logged-in users and guest users (with limit of 5 messages)
router.post('/chat/new', optionalAuth, chatController.createConversation);
router.post('/chat/:chatId/message', optionalAuth, chatLimiter, chatController.sendMessage);
router.post('/chat/:chatId/regenerate', optionalAuth, chatLimiter, chatController.regenerateResponse);
router.get('/chat/search', optionalAuth, chatController.searchConversations);
router.get('/chat/:chatId', optionalAuth, chatController.getConversationById);
router.get('/chats', optionalAuth, chatController.getConversations);
router.put('/chat/:chatId', optionalAuth, chatController.renameConversation);
router.delete('/chat/:chatId', optionalAuth, chatController.deleteConversation);
router.delete('/chat/:chatId/message/:messageId', optionalAuth, chatController.deleteMessage);

module.exports = router;
