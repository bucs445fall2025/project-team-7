<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback } from 'react';
=======
import { useState, useEffect, useRef } from 'react';
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Fetch messages for a conversation
<<<<<<< HEAD
  const fetchMessages = useCallback(async (conversationId) => {
=======
  const fetchMessages = async (conversationId) => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    try {
      const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}/messages`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
<<<<<<< HEAD
  }, []);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
=======
  };

  // Fetch all conversations
  const fetchConversations = async () => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    try {
      const response = await fetch(`${API_URL}/api/chat/conversations`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, []);

  // Create or get conversation
  const createOrGetConversation = useCallback(async (otherUserId, requestId) => {
=======
  };

  // Create or get conversation
  const createOrGetConversation = async (otherUserId, requestId) => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    try {
      const response = await fetch(`${API_URL}/api/chat/conversations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          otherUserId,
          ...(requestId && { requestId })
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversation(conversation);
        await fetchMessages(conversation.id);
        navigate('/chat', { replace: true });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation: ' + error.message);
    }
<<<<<<< HEAD
  }, [fetchMessages, navigate]);
=======
  };
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content
        })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        fetchConversations();
        scrollToBottom();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
        setNewMessage(content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Initialize user from sessionStorage
  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user:', e);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch conversations when user is loaded
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
<<<<<<< HEAD
  }, [user, fetchConversations]);
=======
  }, [user]);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

  // Handle URL params for starting a conversation
  useEffect(() => {
    if (!user) return;
    
    const userId = searchParams.get('userId');
    const requestId = searchParams.get('requestId');

    if (userId) {
      const userIdNum = parseInt(userId);
      if (!isNaN(userIdNum) && userIdNum !== user.id) {
        createOrGetConversation(userIdNum, requestId ? parseInt(requestId) : undefined);
      }
    }
<<<<<<< HEAD
  }, [searchParams, user, createOrGetConversation]);
=======
  }, [searchParams, user]);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id);
      fetchConversations();
    }, 3000);

    return () => clearInterval(interval);
<<<<<<< HEAD
  }, [selectedConversation, fetchMessages, fetchConversations]);
=======
  }, [selectedConversation]);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          ← Back
        </button>
        <h1>Messages</h1>
      </header>

      <div className="chat-layout">
        <div className="conversations-sidebar">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <p className="empty-hint">Start chatting from a request!</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header-row">
                      <span className="conversation-name">{conv.otherUser.name}</span>
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                    {conv.request && (
                      <div className="conversation-request">
                        <span className="request-icon">{conv.request.category?.icon || '📦'}</span>
                        <span className="request-title">{conv.request.title}</span>
                      </div>
                    )}
                    {conv.lastMessage && (
                      <div className="conversation-preview">
                        <span className={`preview-text ${conv.lastMessage.senderId === user?.id ? 'sent' : ''}`}>
                          {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </span>
                        <span className="preview-time">{formatTime(conv.lastMessage.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-area">
          {!selectedConversation ? (
            <div className="no-conversation-selected">
              <div className="empty-chat-icon">💬</div>
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          ) : (
            <>
              <div className="messages-header">
                <div className="messages-header-info">
                  <div className="messages-avatar">
                    {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2>{selectedConversation.otherUser.name}</h2>
                    {selectedConversation.request && (
                      <p className="messages-request-info">
                        <span>{selectedConversation.request.category?.icon || '📦'}</span>
                        {selectedConversation.request.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`message ${isOwn ? 'own' : 'other'}`}
                    >
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={sending || !newMessage.trim()}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
