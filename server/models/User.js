const mongoose = require('mongoose');
const { getDBState } = require('../config/db');
const { readData, writeData, generateId } = require('../data/localStore');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      language: { type: String, default: 'English' }
    }
  },
  { timestamps: true }
);

const MongooseUser = mongoose.model('User', userSchema);

class LocalUser {
  static async findOne(query) {
    const data = readData();
    let found = null;
    if (query.email) {
      found = data.users.find(u => u.email.toLowerCase() === query.email.toLowerCase());
    } else if (query._id) {
      found = data.users.find(u => u._id === query._id.toString());
    }
    return found ? { ...found } : null;
  }

  static async findById(id) {
    return this.findOne({ _id: id });
  }

  static async create(userData) {
    const data = readData();
    const newUser = {
      _id: generateId(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      isAdmin: userData.isAdmin || false,
      preferences: {
        theme: userData.preferences?.theme || 'light',
        language: userData.preferences?.language || 'English'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  }

  static async findByIdAndUpdate(id, updates, options = {}) {
    const data = readData();
    const index = data.users.findIndex(u => u._id === id.toString());
    if (index === -1) return null;
    
    // Deep merge preferences if provided
    if (updates.preferences) {
      data.users[index].preferences = {
        ...data.users[index].preferences,
        ...updates.preferences
      };
      delete updates.preferences;
    }
    
    data.users[index] = {
      ...data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.users[index];
  }

  static async countDocuments() {
    const data = readData();
    return data.users.length;
  }
}

// Proxy wrapper that delegates to MongooseUser if live mongo is connected, else LocalUser
const UserModel = {
  async findOne(query) {
    if (getDBState().isConnected) {
      return MongooseUser.findOne(query);
    }
    return LocalUser.findOne(query);
  },
  async findById(id) {
    if (getDBState().isConnected) {
      return MongooseUser.findById(id);
    }
    return LocalUser.findById(id);
  },
  async create(data) {
    if (getDBState().isConnected) {
      return MongooseUser.create(data);
    }
    return LocalUser.create(data);
  },
  async findByIdAndUpdate(id, updates, options) {
    if (getDBState().isConnected) {
      return MongooseUser.findByIdAndUpdate(id, updates, { new: true, ...options });
    }
    return LocalUser.findByIdAndUpdate(id, updates, options);
  },
  async countDocuments(query = {}) {
    if (getDBState().isConnected) {
      return MongooseUser.countDocuments(query);
    }
    return LocalUser.countDocuments();
  }
};

module.exports = UserModel;
