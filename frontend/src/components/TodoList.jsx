import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onUpdate, onDelete, loading }) {
  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
