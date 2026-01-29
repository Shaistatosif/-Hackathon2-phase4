const todoService = require('./todoService');
const logger = require('../utils/logger');

// Command patterns
const PATTERNS = {
  add: /^(?:add|create|new)\s+(.+)$/i,
  list: /^(?:list|show|todos|all|view)(?:\s+(?:my\s+)?todos?)?$/i,
  complete: /^(?:complete|done|finish|check)\s+(\d+)$/i,
  delete: /^(?:delete|remove|del)\s+(\d+)$/i,
  help: /^(?:help|\?)$/i
};

const HELP_MESSAGE = `Available commands:
• add <task> - Create a new todo (e.g., "add Buy groceries")
• list - Show all your todos
• complete <number> - Mark a todo as done (e.g., "complete 1")
• delete <number> - Remove a todo (e.g., "delete 1")
• help - Show this help message`;

class ChatService {
  processMessage(message) {
    const trimmed = (message || '').trim();

    if (!trimmed) {
      return {
        message: 'Please enter a command. Type "help" for available commands.',
        action: { type: 'unknown', success: false }
      };
    }

    // Check for help
    if (PATTERNS.help.test(trimmed)) {
      return {
        message: HELP_MESSAGE,
        action: { type: 'help', success: true }
      };
    }

    // Check for add
    const addMatch = trimmed.match(PATTERNS.add);
    if (addMatch) {
      return this.handleAdd(addMatch[1]);
    }

    // Check for list
    if (PATTERNS.list.test(trimmed)) {
      return this.handleList();
    }

    // Check for complete
    const completeMatch = trimmed.match(PATTERNS.complete);
    if (completeMatch) {
      return this.handleComplete(parseInt(completeMatch[1], 10));
    }

    // Check for delete
    const deleteMatch = trimmed.match(PATTERNS.delete);
    if (deleteMatch) {
      return this.handleDelete(parseInt(deleteMatch[1], 10));
    }

    // Unknown command
    return {
      message: `I didn't understand "${trimmed}". Type "help" for available commands.`,
      action: { type: 'unknown', success: false }
    };
  }

  handleAdd(description) {
    try {
      const todo = todoService.create(description);
      logger.info('Chat: created todo', { id: todo.id });
      return {
        message: `Created todo: "${todo.description}"`,
        action: { type: 'create', todoId: todo.id, success: true }
      };
    } catch (error) {
      logger.error('Chat: failed to create todo', { error: error.message });
      return {
        message: `Failed to create todo: ${error.message}`,
        action: { type: 'create', success: false }
      };
    }
  }

  handleList() {
    const todos = todoService.list();

    if (todos.length === 0) {
      return {
        message: 'You have no todos. Use "add <task>" to create one.',
        action: { type: 'list', success: true, todos: [] }
      };
    }

    const todoList = todos.map((t, i) => {
      const status = t.completed ? '✓' : '○';
      return `${i + 1}. ${status} ${t.description}`;
    }).join('\n');

    return {
      message: `Your todos:\n${todoList}`,
      action: { type: 'list', success: true, todos }
    };
  }

  handleComplete(index) {
    const todo = todoService.getByIndex(index - 1);

    if (!todo) {
      return {
        message: `Todo #${index} not found. Use "list" to see your todos.`,
        action: { type: 'complete', success: false }
      };
    }

    try {
      const updated = todoService.update(todo.id, { completed: true });
      logger.info('Chat: completed todo', { id: todo.id });
      return {
        message: `Completed: "${updated.description}"`,
        action: { type: 'complete', todoId: todo.id, success: true }
      };
    } catch (error) {
      logger.error('Chat: failed to complete todo', { error: error.message });
      return {
        message: `Failed to complete todo: ${error.message}`,
        action: { type: 'complete', success: false }
      };
    }
  }

  handleDelete(index) {
    const todo = todoService.getByIndex(index - 1);

    if (!todo) {
      return {
        message: `Todo #${index} not found. Use "list" to see your todos.`,
        action: { type: 'delete', success: false }
      };
    }

    try {
      todoService.delete(todo.id);
      logger.info('Chat: deleted todo', { id: todo.id });
      return {
        message: `Deleted: "${todo.description}"`,
        action: { type: 'delete', todoId: todo.id, success: true }
      };
    } catch (error) {
      logger.error('Chat: failed to delete todo', { error: error.message });
      return {
        message: `Failed to delete todo: ${error.message}`,
        action: { type: 'delete', success: false }
      };
    }
  }
}

// Singleton instance
const chatService = new ChatService();

module.exports = chatService;
