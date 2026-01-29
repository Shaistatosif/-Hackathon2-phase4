const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const logger = require('../utils/logger');

// POST /chat - Process chat message
router.post('/', (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Message is required'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Message cannot exceed 1000 characters'
      });
    }

    const response = chatService.processMessage(message);
    res.json(response);
  } catch (error) {
    logger.error('Failed to process chat message', { error: error.message });
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to process message'
    });
  }
});

module.exports = router;
