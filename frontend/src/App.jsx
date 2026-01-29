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
      <header className="app-header">
        <h1>Todo Chatbot</h1>
      </header>
      <main className="app-content">
        <div className="panel todo-panel">
          <h2>My Todos</h2>
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
          <h2>Chat Assistant</h2>
          <ChatPanel onTodoChange={handleTodoChange} />
        </div>
      </main>
    </div>
  );
}

export default App;
