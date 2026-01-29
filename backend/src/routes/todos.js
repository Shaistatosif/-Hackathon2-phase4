const express = require('express');
const router = express.Router();
const todoService = require('../services/todoService');
const Todo = require('../models/todo');
const logger = require('../utils/logger');

// GET /todos - List all todos
router.get('/', (req, res) => {
  try {
    const todos = todoService.list();
    res.json(todos);
  } catch (error) {
    logger.error('Failed to list todos', { error: error.message });
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve todos'
    });
  }
});

// POST /todos - Create new todo
router.post('/', (req, res) => {
  try {
    const { description } = req.body;

    // Validate input
    const validation = Todo.validate(description);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: validation.error
      });
    }

    const todo = todoService.create(description);
    res.status(201).json(todo);
  } catch (error) {
    logger.error('Failed to create todo', { error: error.message });
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to create todo'
    });
  }
});

// GET /todos/:id - Get single todo
router.get('/:id', (req, res) => {
  try {
    const todo = todoService.get(req.params.id);
    if (!todo) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Todo not found'
      });
    }
    res.json(todo);
  } catch (error) {
    logger.error('Failed to get todo', { error: error.message, id: req.params.id });
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve todo'
    });
  }
});

// PUT /todos/:id - Update todo
router.put('/:id', (req, res) => {
  try {
    const { description, completed } = req.body;

    // Validate description if provided
    if (description !== undefined) {
      const validation = Todo.validate(description);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: validation.error
        });
      }
    }

    const todo = todoService.update(req.params.id, { description, completed });
    if (!todo) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Todo not found'
      });
    }
    res.json(todo);
  } catch (error) {
    logger.error('Failed to update todo', { error: error.message, id: req.params.id });
    if (error.message.includes('cannot be empty') || error.message.includes('cannot exceed')) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: error.message
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update todo'
    });
  }
});

// DELETE /todos/:id - Delete todo
router.delete('/:id', (req, res) => {
  try {
    const deleted = todoService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Todo not found'
      });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete todo', { error: error.message, id: req.params.id });
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to delete todo'
    });
  }
});

module.exports = router;
