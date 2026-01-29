# Data Model: Cloud Native Todo Chatbot

**Feature**: 001-todo-chatbot
**Date**: 2026-01-21

## Entities

### Todo

Represents a task item in the todo list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| description | string | Yes | Task description (1-1000 chars) |
| completed | boolean | Yes | Completion status (default: false) |
| createdAt | ISO 8601 datetime | Yes | Creation timestamp |
| updatedAt | ISO 8601 datetime | Yes | Last modification timestamp |

**Validation Rules**:
- `description` MUST be non-empty and <= 1000 characters
- `id` MUST be unique across all todos
- `createdAt` MUST be set on creation, never modified
- `updatedAt` MUST be updated on any field change

**State Transitions**:
```
[New] --create--> [Active] --complete--> [Completed]
                     ^                        |
                     |------uncomplete--------|

[Active/Completed] --delete--> [Deleted]
```

### ChatMessage

Represents a single message in the chat interface.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| text | string | Yes | Message content (1-1000 chars) |
| sender | enum | Yes | "user" or "bot" |
| timestamp | ISO 8601 datetime | Yes | When message was sent |
| action | object or null | No | Associated todo action (if any) |

**Action Object Structure** (when present):
| Field | Type | Description |
|-------|------|-------------|
| type | enum | "create", "list", "complete", "delete" |
| todoId | string or null | Related todo ID (if applicable) |
| success | boolean | Whether action succeeded |

### ChatSession

Represents a user's chat session (in-memory only, not persisted).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionId | string | Yes | Browser session identifier |
| messages | ChatMessage[] | Yes | Array of chat messages |
| startedAt | ISO 8601 datetime | Yes | Session start time |

**Notes**:
- Sessions are ephemeral (in-memory only)
- Messages are retained for UI display during session
- No cross-session message persistence required

## Relationships

```
┌─────────────┐
│    Todo     │
└─────────────┘
       ▲
       │ references (todoId)
       │
┌─────────────┐         ┌──────────────┐
│ ChatMessage │─────────│ ChatSession  │
└─────────────┘ many-to │              │
                  one   └──────────────┘
```

## Storage Schema

### todos.json (Backend persistence file)

```json
{
  "todos": [
    {
      "id": "uuid-string",
      "description": "Task description",
      "completed": false,
      "createdAt": "2026-01-21T10:00:00Z",
      "updatedAt": "2026-01-21T10:00:00Z"
    }
  ],
  "metadata": {
    "version": 1,
    "lastModified": "2026-01-21T10:00:00Z"
  }
}
```

## Indexes / Query Patterns

| Query | Access Pattern | Frequency |
|-------|----------------|-----------|
| List all todos | Full scan of todos array | High |
| Get todo by ID | Filter by id | Medium |
| Create todo | Append to array | Medium |
| Update todo | Find by id, update in place | Medium |
| Delete todo | Filter out by id | Low |

**Note**: Given the hackathon scope (single user, small dataset), no indexing optimization is needed. Linear scans are acceptable.
