const mongoose = require('mongoose');
const { getDBState } = require('../config/db');
const { readData, writeData, generateId } = require('../data/localStore');

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    messageCount: { type: Number, default: 0 },
    lastMessage: { type: String, default: '' },
    isPinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const MongooseConversation = mongoose.model('Conversation', conversationSchema);

class LocalConversation {
  static async find(query = {}) {
    const data = readData();
    let res = data.conversations;
    if (query.userId) {
      res = res.filter(c => c.userId === query.userId.toString());
    }
    // Sort by pinned first, then updatedAt descending
    return res.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  static async findOne(query) {
    const data = readData();
    if (query._id) {
      return data.conversations.find(c => c._id === query._id.toString()) || null;
    }
    if (query.userId) {
      return data.conversations.find(c => c.userId === query.userId.toString()) || null;
    }
    return null;
  }

  static async findById(id) {
    return this.findOne({ _id: id });
  }

  static async create(convData) {
    const data = readData();
    const newConv = {
      _id: convData._id ? convData._id.toString() : generateId(),
      userId: convData.userId.toString(),
      title: convData.title || 'New Conversation',
      messageCount: convData.messageCount || 0,
      lastMessage: convData.lastMessage || '',
      isPinned: convData.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.conversations.unshift(newConv);
    writeData(data);
    return newConv;
  }

  static async findByIdAndUpdate(id, updates, options = {}) {
    const data = readData();
    const index = data.conversations.findIndex(c => c._id === id.toString());
    if (index === -1) return null;
    data.conversations[index] = {
      ...data.conversations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.conversations[index];
  }

  static async findByIdAndDelete(id) {
    const data = readData();
    const index = data.conversations.findIndex(c => c._id === id.toString());
    if (index === -1) return null;
    const removed = data.conversations.splice(index, 1)[0];
    // Also remove associated messages
    data.messages = data.messages.filter(m => m.conversationId !== id.toString());
    writeData(data);
    return removed;
  }

  static async countDocuments(query = {}) {
    const data = readData();
    if (query.userId) {
      return data.conversations.filter(c => c.userId === query.userId.toString()).length;
    }
    return data.conversations.length;
  }
}

const ConversationModel = {
  async find(query = {}) {
    if (getDBState().isConnected) {
      return MongooseConversation.find(query).sort({ isPinned: -1, updatedAt: -1 });
    }
    return LocalConversation.find(query);
  },
  async findById(id) {
    if (getDBState().isConnected) {
      return MongooseConversation.findById(id);
    }
    return LocalConversation.findById(id);
  },
  async findOne(query) {
    if (getDBState().isConnected) {
      return MongooseConversation.findOne(query);
    }
    return LocalConversation.findOne(query);
  },
  async create(data) {
    if (getDBState().isConnected) {
      return MongooseConversation.create(data);
    }
    return LocalConversation.create(data);
  },
  async findByIdAndUpdate(id, updates, options) {
    if (getDBState().isConnected) {
      return MongooseConversation.findByIdAndUpdate(id, updates, { new: true, ...options });
    }
    return LocalConversation.findByIdAndUpdate(id, updates, options);
  },
  async findByIdAndDelete(id) {
    if (getDBState().isConnected) {
      return MongooseConversation.findByIdAndDelete(id);
    }
    return LocalConversation.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    if (getDBState().isConnected) {
      return MongooseConversation.countDocuments(query);
    }
    return LocalConversation.countDocuments(query);
  }
};

module.exports = ConversationModel;
