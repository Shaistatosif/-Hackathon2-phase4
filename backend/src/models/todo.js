const { v4: uuidv4 } = require('uuid');

class Todo {
  constructor({ id, description, completed = false, createdAt, updatedAt }) {
    this.id = id || uuidv4();
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static validate(description) {
    if (!description || typeof description !== 'string') {
      return { valid: false, error: 'Todo description cannot be empty' };
    }

    const trimmed = description.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: 'Todo description cannot be empty' };
    }

    if (trimmed.length > 1000) {
      return { valid: false, error: 'Todo description cannot exceed 1000 characters' };
    }

    return { valid: true, description: trimmed };
  }

  update({ description, completed }) {
    if (description !== undefined) {
      const validation = Todo.validate(description);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      this.description = validation.description;
    }

    if (completed !== undefined) {
      this.completed = Boolean(completed);
    }

    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Todo;
