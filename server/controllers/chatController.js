const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const aiService = require('../services/aiService');
const config = require('../config/config');

// In-memory guest counter tracking: guestId -> messageCount
const guestUsageMap = new Map();

exports.createConversation = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.body.guestId || 'guest');
    const { title } = req.body;

    const conversation = await Conversation.create({
      userId,
      title: title || 'New Chat',
      messageCount: 0,
      lastMessage: ''
    });

    return res.status(201).json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error('[Create Conversation Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to create conversation.' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.query.guestId || 'guest');
    const conversations = await Conversation.find({ userId });

    return res.status(200).json({
      success: true,
      conversations
    });
  } catch (err) {
    console.error('[Get Conversations Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversations.' });
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const conversation = await Conversation.findById(chatId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const messages = await Message.find({ conversationId: chatId });

    return res.status(200).json({
      success: true,
      conversation,
      messages
    });
  } catch (err) {
    console.error('[Get Conversation By ID Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to load conversation.' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, guestId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const sanitizedMessage = message.trim();

    // Handle guest message limits
    if (!req.user) {
      const gid = guestId || req.ip || 'anonymous-guest';
      const count = guestUsageMap.get(gid) || 0;
      if (count >= config.maxGuestMessages) {
        return res.status(403).json({
          success: false,
          requireSignup: true,
          message: `Guest message limit reached (${config.maxGuestMessages}/${config.maxGuestMessages}). Please sign up to continue chatting.`
        });
      }
      guestUsageMap.set(gid, count + 1);
    }

    let conversation = await Conversation.findById(chatId);
    const userId = req.user ? req.user._id : (guestId || 'guest');

    if (!conversation) {
      // Auto-create conversation if doesn't exist yet
      const autoTitle = sanitizedMessage.slice(0, 36) + (sanitizedMessage.length > 36 ? '...' : '');
      conversation = await Conversation.create({
        _id: chatId,
        userId,
        title: autoTitle,
        messageCount: 0,
        lastMessage: sanitizedMessage
      });
    }

    // 1. Save User Message
    const userMsg = await Message.create({
      conversationId: chatId,
      userId,
      role: 'user',
      content: sanitizedMessage,
      category: aiService.detectCategory(sanitizedMessage),
      timestamp: new Date().toISOString()
    });

    // 2. Fetch past messages for context
    const previousMessages = await Message.find({ conversationId: chatId });

    // 3. Generate AI Response
    const aiResult = await aiService.generateResponse({
      message: sanitizedMessage,
      history: previousMessages,
      userPreferences: req.user ? req.user.preferences : {}
    });

    // 4. Save AI Message
    const aiMsg = await Message.create({
      conversationId: chatId,
      userId,
      role: 'ai',
      content: aiResult.content,
      category: aiResult.category,
      followUpSuggestions: aiResult.followUpSuggestions,
      timestamp: new Date().toISOString()
    });

    // 5. Update Conversation summary & title if first message
    const totalCount = await Message.countDocuments({ conversationId: chatId });
    let updatedTitle = conversation.title;
    if (conversation.title === 'New Chat' || conversation.title === 'New Conversation') {
      updatedTitle = sanitizedMessage.slice(0, 32) + (sanitizedMessage.length > 32 ? '...' : '');
    }

    const updatedConv = await Conversation.findByIdAndUpdate(chatId, {
      title: updatedTitle,
      messageCount: totalCount,
      lastMessage: aiResult.content.slice(0, 80) + '...',
      updatedAt: new Date().toISOString()
    });

    const guestRemaining = !req.user
      ? Math.max(0, config.maxGuestMessages - (guestUsageMap.get(guestId || req.ip || 'anonymous-guest') || 0))
      : null;

    return res.status(200).json({
      success: true,
      userMessage: userMsg,
      aiMessage: aiMsg,
      conversation: updatedConv,
      guestRemaining
    });
  } catch (err) {
    console.error('[Send Message Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to process message. Please retry.' });
  }
};

exports.regenerateResponse = async (req, res) => {
  try {
    const { chatId } = req.params;
    const conversation = await Conversation.findById(chatId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const messages = await Message.find({ conversationId: chatId });
    if (messages.length === 0) {
      return res.status(400).json({ success: false, message: 'No messages to regenerate.' });
    }

    // Find the last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) {
      return res.status(400).json({ success: false, message: 'No user message found to regenerate from.' });
    }

    // If the very last message is AI, remove it before regenerating
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'ai') {
      await Message.findByIdAndDelete(lastMsg._id);
    }

    // Generate new AI response
    const contextMsgs = await Message.find({ conversationId: chatId });
    const aiResult = await aiService.generateResponse({
      message: lastUserMsg.content,
      history: contextMsgs,
      userPreferences: req.user ? req.user.preferences : {}
    });

    const newAiMsg = await Message.create({
      conversationId: chatId,
      userId: req.user ? req.user._id : 'guest',
      role: 'ai',
      content: aiResult.content,
      category: aiResult.category,
      followUpSuggestions: aiResult.followUpSuggestions,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      aiMessage: newAiMsg
    });
  } catch (err) {
    console.error('[Regenerate Response Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to regenerate response.' });
  }
};

exports.renameConversation = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title, isPinned } = req.body;

    const updates = {};
    if (typeof title === 'string' && title.trim()) updates.title = title.trim();
    if (typeof isPinned === 'boolean') updates.isPinned = isPinned;

    const updated = await Conversation.findByIdAndUpdate(chatId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    return res.status(200).json({ success: true, conversation: updated });
  } catch (err) {
    console.error('[Rename Conversation Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to update conversation.' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Conversation.findByIdAndDelete(chatId);
    await Message.deleteMany({ conversationId: chatId });

    return res.status(200).json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (err) {
    console.error('[Delete Conversation Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete conversation.' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    
    // Update conversation message count
    const count = await Message.countDocuments({ conversationId: chatId });
    await Conversation.findByIdAndUpdate(chatId, { messageCount: count });

    return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('[Delete Message Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};

exports.searchConversations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.query.guestId || 'guest');
    const query = (req.query.q || '').toLowerCase().trim();

    if (!query) {
      const all = await Conversation.find({ userId });
      return res.status(200).json({ success: true, conversations: all });
    }

    const conversations = await Conversation.find({ userId });
    const matched = conversations.filter(c => 
      c.title.toLowerCase().includes(query) || 
      (c.lastMessage && c.lastMessage.toLowerCase().includes(query))
    );

    return res.status(200).json({
      success: true,
      conversations: matched
    });
  } catch (err) {
    console.error('[Search Conversations Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to search conversations.' });
  }
};
