import React, { useState } from 'react';

function TodoForm({ onAdd, disabled }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = description.trim();
    if (!trimmed) {
      setError('Todo description cannot be empty');
      return;
    }

    if (trimmed.length > 1000) {
      setError('Todo description cannot exceed 1000 characters');
      return;
    }

    try {
      await onAdd(trimmed);
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-input">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
          disabled={disabled}
          maxLength={1000}
        />
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          Add
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default TodoForm;
