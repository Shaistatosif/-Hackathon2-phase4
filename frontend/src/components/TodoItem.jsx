import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.description);
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveEdit = async () => {
    setError('');
    const trimmed = editText.trim();

    if (!trimmed) {
      setError('Todo description cannot be empty');
      return;
    }

    try {
      await onUpdate(todo.id, { description: trimmed });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.description);
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(todo.id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="todo-item-edit">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={1000}
          />
          <div className="todo-item-actions">
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="todo-item-view">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
          />
          <span className="todo-item-text">{todo.description}</span>
          <div className="todo-item-actions">
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
