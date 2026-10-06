const mongoose = require('mongoose');
const { getDBState } = require('../config/db');
const { readData, writeData, generateId } = require('../data/localStore');

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Programming', 'Project', 'Career', 'Interview', 'Resume', 'General'],
      default: 'General'
    },
    followUpSuggestions: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

const MongooseMessage = mongoose.model('Message', messageSchema);

class LocalMessage {
  static async find(query = {}) {
    const data = readData();
    let res = data.messages;
    if (query.conversationId) {
      res = res.filter(m => m.conversationId === query.conversationId.toString());
    }
    if (query.userId) {
      res = res.filter(m => m.userId === query.userId.toString());
    }
    return res.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  static async findById(id) {
    const data = readData();
    return data.messages.find(m => m._id === id.toString()) || null;
  }

  static async create(msgData) {
    const data = readData();
    const newMsg = {
      _id: generateId(),
      conversationId: msgData.conversationId.toString(),
      userId: msgData.userId.toString(),
      role: msgData.role,
      content: msgData.content,
      category: msgData.category || 'General',
      followUpSuggestions: msgData.followUpSuggestions || [],
      timestamp: msgData.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.messages.push(newMsg);
    writeData(data);
    return newMsg;
  }

  static async findByIdAndDelete(id) {
    const data = readData();
    const index = data.messages.findIndex(m => m._id === id.toString());
    if (index === -1) return null;
    const removed = data.messages.splice(index, 1)[0];
    writeData(data);
    return removed;
  }

  static async deleteMany(query = {}) {
    const data = readData();
    const initialLen = data.messages.length;
    if (query.conversationId) {
      data.messages = data.messages.filter(m => m.conversationId !== query.conversationId.toString());
    }
    writeData(data);
    return { deletedCount: initialLen - data.messages.length };
  }

  static async countDocuments(query = {}) {
    const data = readData();
    if (query.userId) {
      return data.messages.filter(m => m.userId === query.userId.toString()).length;
    }
    return data.messages.length;
  }

  static async getAllForStats() {
    const data = readData();
    return data.messages;
  }
}

const MessageModel = {
  async find(query = {}) {
    if (getDBState().isConnected) {
      return MongooseMessage.find(query).sort({ timestamp: 1 });
    }
    return LocalMessage.find(query);
  },
  async findById(id) {
    if (getDBState().isConnected) {
      return MongooseMessage.findById(id);
    }
    return LocalMessage.findById(id);
  },
  async create(data) {
    if (getDBState().isConnected) {
      return MongooseMessage.create(data);
    }
    return LocalMessage.create(data);
  },
  async findByIdAndDelete(id) {
    if (getDBState().isConnected) {
      return MongooseMessage.findByIdAndDelete(id);
    }
    return LocalMessage.findByIdAndDelete(id);
  },
  async deleteMany(query) {
    if (getDBState().isConnected) {
      return MongooseMessage.deleteMany(query);
    }
    return LocalMessage.deleteMany(query);
  },
  async countDocuments(query = {}) {
    if (getDBState().isConnected) {
      return MongooseMessage.countDocuments(query);
    }
    return LocalMessage.countDocuments(query);
  },
  async getAllForStats() {
    if (getDBState().isConnected) {
      return MongooseMessage.find({});
    }
    return LocalMessage.getAllForStats();
  }
};

module.exports = MessageModel;
