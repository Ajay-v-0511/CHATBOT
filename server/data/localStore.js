const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const storeFile = path.join(__dirname, 'store.json');

const defaultData = {
  users: [],
  conversations: [],
  messages: []
};

const readData = () => {
  try {
    if (!fs.existsSync(storeFile)) {
      fs.writeFileSync(storeFile, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(storeFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local store:', err);
    return defaultData;
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local store:', err);
  }
};

const generateId = () => crypto.randomBytes(12).toString('hex');

module.exports = {
  readData,
  writeData,
  generateId
};
