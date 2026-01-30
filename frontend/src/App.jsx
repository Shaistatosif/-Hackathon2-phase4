import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ChatPanel from './components/ChatPanel';
import api from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.todos.list();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (description) => {
    const newTodo = await api.todos.create(description);
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleUpdateTodo = async (id, data) => {
    const updatedTodo = await api.todos.update(id, data);
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  const handleDeleteTodo = async (id) => {
    await api.todos.delete(id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Refresh todos when chat modifies them
  const handleTodoChange = () => {
    loadTodos();
  };

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <header className="app-header">
        <div className="logo-container">
          <div className="robot-icon">
            <svg viewBox="0 0 100 100" className="robot-svg">
              <defs>
                <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2e8b57" />
                  <stop offset="50%" stopColor="#3cb371" />
                  <stop offset="100%" stopColor="#20b2aa" />
                </linearGradient>
              </defs>
              {/* Robot Head */}
              <rect x="25" y="20" width="50" height="45" rx="10" fill="url(#robotGradient)" />
              {/* Antenna */}
              <line x1="50" y1="20" x2="50" y2="8" stroke="url(#robotGradient)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="5" r="5" fill="#20b2aa" className="antenna-light" />
              {/* Eyes */}
              <circle cx="38" cy="38" r="7" fill="#000" />
              <circle cx="62" cy="38" r="7" fill="#000" />
              <circle cx="40" cy="36" r="3" fill="#fff" className="eye-shine" />
              <circle cx="64" cy="36" r="3" fill="#fff" className="eye-shine" />
              {/* Mouth */}
              <rect x="35" y="52" width="30" height="6" rx="3" fill="#000" />
              {/* Body */}
              <rect x="30" y="68" width="40" height="25" rx="5" fill="url(#robotGradient)" />
              {/* Body Details */}
              <circle cx="50" cy="80" r="6" fill="#000" />
              <circle cx="50" cy="80" r="3" fill="#20b2aa" className="body-light" />
            </svg>
          </div>
        </div>
        <h1>Shaista's Todo Chatbot</h1>
        <p className="tagline">Your AI-Powered Task Assistant</p>
        <div className="header-badge">
          <span className="badge-dot"></span>
          <span>Cloud Native App</span>
        </div>
      </header>

      <main className="app-content">
        <div className="panel todo-panel">
          <div className="panel-header">
            <div className="panel-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h2>My Todos</h2>
            <span className="todo-count">{todos.length}</span>
          </div>
          {error && <div className="error">{error}</div>}
          <TodoForm onAdd={handleAddTodo} disabled={loading} />
          <TodoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            loading={loading}
          />
        </div>

        <div className="panel chat-panel">
          <div className="panel-header">
            <div className="panel-icon chat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h2>AI Chat Assistant</h2>
            <span className="status-badge">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
          <ChatPanel onTodoChange={handleTodoChange} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Developed by <span className="developer-name">Shaista Tosif</span></p>
        <div className="tech-stack">
          <span>React</span>
          <span>Node.js</span>
          <span>Docker</span>
          <span>Kubernetes</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
