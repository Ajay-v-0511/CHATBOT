const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();

    // Fetch all messages to compute category distribution and daily trends
    const allMessages = await Message.getAllForStats();
    const allConversations = await Conversation.find();

    // 1. Category Distribution
    const categoryCounts = {
      Academic: 0,
      Programming: 0,
      Project: 0,
      Career: 0,
      Interview: 0,
      Resume: 0,
      General: 0
    };

    // 2. Daily message trends (group by YYYY-MM-DD)
    const dailyMap = {};

    allMessages.forEach(msg => {
      // Category count
      const cat = msg.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // Daily trend
      const dateStr = (msg.timestamp ? new Date(msg.timestamp) : new Date()).toISOString().split('T')[0];
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
    });

    // Format daily trends for charts (last 7 days or recorded days)
    const dailyTrends = Object.keys(dailyMap)
      .sort()
      .slice(-7)
      .map(date => ({
        date,
        messages: dailyMap[date]
      }));

    if (dailyTrends.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      dailyTrends.push({ date: today, messages: totalMessages });
    }

    // Average messages per conversation
    const avgMessagesPerConversation = totalConversations > 0
      ? Number((totalMessages / totalConversations).toFixed(1))
      : 0;

    // Recent conversations
    const recentConversations = allConversations
      .slice(0, 10)
      .map(c => ({
        id: c._id,
        title: c.title,
        messageCount: c.messageCount || 0,
        updatedAt: c.updatedAt
      }));

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalConversations,
        totalMessages,
        avgMessagesPerConversation,
        categories: categoryCounts,
        dailyTrends,
        recentConversations
      }
    });
  } catch (err) {
    console.error('[Admin Stats Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin statistics.' });
  }
};
