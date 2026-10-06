import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, setGuestRemaining, openAuthModal } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorBanner, setErrorBanner] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  // Load conversations on mount or when auth state changes
  useEffect(() => {
    loadConversations();
  }, [isAuthenticated]);

  const loadConversations = async () => {
    setLoadingChats(true);
    try {
      const res = await api.getChats();
      if (res.success) {
        setConversations(res.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  // When switching chat
  const selectConversation = async (chatId) => {
    if (!chatId) {
      setCurrentChatId(null);
      setMessages([]);
      return;
    }

    setCurrentChatId(chatId);
    setErrorBanner(null);
    try {
      const res = await api.getChatById(chatId);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err);
      setErrorBanner('Could not load conversation history.');
    }
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setErrorBanner(null);
  };

  const sendMessage = async (content) => {
    if (!content || !content.trim()) return;
    const text = content.trim();

    setErrorBanner(null);
    setLastFailedMessage(null);
    setIsSending(true);

    let activeChatId = currentChatId;

    // Optimistic user message preview
    const tempUserMsg = {
      _id: 'temp-' + Date.now(),
      role: 'user',
      content: text,
      category: 'General',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // If no active chat, create one or use a new ID
      if (!activeChatId) {
        const createRes = await api.createChat(text.slice(0, 32));
        if (createRes.success && createRes.conversation) {
          activeChatId = createRes.conversation._id;
          setCurrentChatId(activeChatId);
        } else {
          activeChatId = 'chat_' + Date.now();
          setCurrentChatId(activeChatId);
        }
      }

      const res = await api.sendMessage(activeChatId, text);
      if (res.success) {
        // Replace temp message with server message and add AI response
        setMessages(prev => {
          const filtered = prev.filter(m => m._id !== tempUserMsg._id);
          return [...filtered, res.userMessage, res.aiMessage];
        });

        if (res.guestRemaining !== null && res.guestRemaining !== undefined) {
          setGuestRemaining(res.guestRemaining);
        }

        // Refresh conversation list in sidebar
        loadConversations();
      }
    } catch (err) {
      console.error('Send message failed:', err);
      // Revert temp user message
      setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      setLastFailedMessage(text);

      if (err.data?.requireSignup) {
        setErrorBanner(err.data.message);
        openAuthModal('signup');
      } else {
        setErrorBanner(err.message || 'Failed to get response. Please retry.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const retryLastMessage = () => {
    if (lastFailedMessage) {
      sendMessage(lastFailedMessage);
    }
  };

  const regenerateResponse = async () => {
    if (!currentChatId || isSending) return;
    setIsSending(true);
    setErrorBanner(null);

    try {
      const res = await api.regenerate(currentChatId);
      if (res.success) {
        // Reload messages for the current chat
        const chatRes = await api.getChatById(currentChatId);
        if (chatRes.success) {
          setMessages(chatRes.messages);
        }
        loadConversations();
      }
    } catch (err) {
      console.error('Regenerate failed:', err);
      setErrorBanner('Failed to regenerate response. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const renameConversation = async (chatId, title) => {
    try {
      const res = await api.renameChat(chatId, title);
      if (res.success) {
        setConversations(prev =>
          prev.map(c => (c._id === chatId ? { ...c, title } : c))
        );
      }
    } catch (err) {
      console.error('Failed to rename chat:', err);
    }
  };

  const togglePinConversation = async (chatId, currentPinned) => {
    try {
      const res = await api.renameChat(chatId, undefined, !currentPinned);
      if (res.success) {
        setConversations(prev =>
          prev.map(c => (c._id === chatId ? { ...c, isPinned: !currentPinned } : c))
        );
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  const deleteConversation = async (chatId) => {
    try {
      const res = await api.deleteChat(chatId);
      if (res.success) {
        setConversations(prev => prev.filter(c => c._id !== chatId));
        if (currentChatId === chatId) {
          createNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!currentChatId) return;
    try {
      const res = await api.deleteMessage(currentChatId, messageId);
      if (res.success) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
        loadConversations();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const clearChat = () => {
    if (currentChatId) {
      deleteConversation(currentChatId);
    } else {
      setMessages([]);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const res = await api.searchChats(query);
      if (res.success) {
        setConversations(res.conversations || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const currentChat = conversations.find(c => c._id === currentChatId) || null;

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentChatId,
        currentChat,
        messages,
        loadingChats,
        isSending,
        searchQuery,
        errorBanner,
        lastFailedMessage,
        selectConversation,
        createNewChat,
        sendMessage,
        regenerateResponse,
        renameConversation,
        togglePinConversation,
        deleteConversation,
        deleteMessage,
        clearChat,
        handleSearch,
        retryLastMessage,
        setErrorBanner
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
