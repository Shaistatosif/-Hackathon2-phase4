import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function ChatPanel({ onTodoChange }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I can help you manage your todos. Type "help" to see available commands.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chat.send(trimmed);

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        action: response.action
      };
      setMessages(prev => [...prev, botMessage]);

      // Notify parent if todo was changed
      if (response.action && response.action.success &&
          ['create', 'complete', 'delete'].includes(response.action.type)) {
        onTodoChange?.();
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}`,
        sender: 'bot',
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender} ${msg.error ? 'error' : ''}`}
          >
            <div className="chat-message-content">
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="chat-message-content typing">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          disabled={loading}
          maxLength={1000}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
