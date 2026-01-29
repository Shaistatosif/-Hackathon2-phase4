const fs = require('fs');
const path = require('path');
const Todo = require('../models/todo');
const logger = require('../utils/logger');

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '../../data/todos.json');

class TodoService {
  constructor() {
    this.todos = new Map();
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        if (data.todos && Array.isArray(data.todos)) {
          data.todos.forEach(todoData => {
            const todo = new Todo(todoData);
            this.todos.set(todo.id, todo);
          });
          logger.info('Loaded todos from file', { count: this.todos.size });
        }
      }
    } catch (error) {
      logger.error('Failed to load todos from file', { error: error.message });
    }
  }

  saveToFile() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const data = {
        todos: Array.from(this.todos.values()).map(t => t.toJSON()),
        metadata: {
          version: 1,
          lastModified: new Date().toISOString()
        }
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      logger.debug('Saved todos to file', { count: this.todos.size });
    } catch (error) {
      logger.error('Failed to save todos to file', { error: error.message });
    }
  }

  list() {
    return Array.from(this.todos.values()).map(t => t.toJSON());
  }

  get(id) {
    const todo = this.todos.get(id);
    return todo ? todo.toJSON() : null;
  }

  create(description) {
    const validation = Todo.validate(description);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const todo = new Todo({ description: validation.description });
    this.todos.set(todo.id, todo);
    this.saveToFile();

    logger.info('Created todo', { id: todo.id });
    return todo.toJSON();
  }

  update(id, data) {
    const todo = this.todos.get(id);
    if (!todo) {
      return null;
    }

    todo.update(data);
    this.saveToFile();

    logger.info('Updated todo', { id });
    return todo.toJSON();
  }

  delete(id) {
    const existed = this.todos.has(id);
    if (existed) {
      this.todos.delete(id);
      this.saveToFile();
      logger.info('Deleted todo', { id });
    }
    return existed;
  }

  // Helper for chat service
  getByIndex(index) {
    const todos = this.list();
    if (index >= 0 && index < todos.length) {
      return todos[index];
    }
    return null;
  }
}

// Singleton instance
const todoService = new TodoService();

module.exports = todoService;
