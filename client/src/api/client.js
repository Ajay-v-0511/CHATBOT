// API client with token & guest handling
const API_BASE = '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getGuestId = () => {
  let gid = localStorage.getItem('smartassist_guest_id');
  if (!gid) {
    gid = 'guest_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('smartassist_guest_id', gid);
  }
  return gid;
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Network request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Auth
  async signup(email, password, isAdmin = false) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isAdmin })
    });
    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Chats
  async getChats() {
    const guestId = getGuestId();
    const res = await fetch(`${API_BASE}/api/chats?guestId=${guestId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createChat(title = 'New Chat') {
    const guestId = getGuestId();
    const res = await fetch(`${API_BASE}/api/chat/new`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, guestId })
    });
    return handleResponse(res);
  },

  async getChatById(chatId) {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async sendMessage(chatId, message) {
    const guestId = getGuestId();
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, guestId })
    });
    return handleResponse(res);
  },

  async regenerate(chatId) {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/regenerate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async renameChat(chatId, title, isPinned) {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, isPinned })
    });
    return handleResponse(res);
  },

  async deleteChat(chatId) {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async deleteMessage(chatId, messageId) {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/message/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async searchChats(query) {
    const guestId = getGuestId();
    const res = await fetch(`${API_BASE}/api/chat/search?q=${encodeURIComponent(query)}&guestId=${guestId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // User Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/api/user/settings`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/api/user/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
