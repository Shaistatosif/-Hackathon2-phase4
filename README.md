# Todo Chatbot

A cloud-native todo application with a conversational chat interface. Manage your tasks through both a traditional UI and natural language commands.

## Features

- **Todo Management**: Create, read, update, and delete todos
- **Chat Interface**: Manage todos using natural language commands
- **Responsive UI**: Works on desktop and mobile devices
- **Kubernetes Ready**: Helm charts for easy deployment
- **Containerized**: Docker images for both frontend and backend

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Styling | CSS3 |
| Container | Docker |
| Orchestration | Kubernetes + Helm |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Run Locally

**Backend:**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## Chat Commands

| Command | Description | Example |
|---------|-------------|---------|
| `add <task>` | Create a new todo | `add Buy groceries` |
| `list` | Show all todos | `list` |
| `complete <number>` | Mark todo as done | `complete 1` |
| `delete <number>` | Remove a todo | `delete 1` |
| `help` | Show available commands | `help` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/todos` | List all todos |
| POST | `/todos` | Create a todo |
| GET | `/todos/:id` | Get a todo |
| PUT | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |
| POST | `/chat` | Send chat message |

## Docker

**Build Images:**
```bash
# Backend
docker build -t todo-backend ./backend

# Frontend
docker build -t todo-frontend ./frontend
```

**Run Containers:**
```bash
# Backend
docker run -p 3000:3000 todo-backend

# Frontend
docker run -p 80:80 todo-frontend
```

## Kubernetes Deployment

**Using Helm:**
```bash
# Start Minikube
minikube start

# Build images in Minikube
eval $(minikube docker-env)
docker build -t todo-backend ./backend
docker build -t todo-frontend ./frontend

# Deploy
helm install todo-chatbot ./helm/todo-chatbot

# Access the app
minikube service todo-frontend --url
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── models/      # Data models
│   │   └── utils/       # Utilities
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── styles/      # CSS styles
│   ├── Dockerfile
│   └── package.json
├── helm/
│   └── todo-chatbot/    # Helm chart
└── specs/               # Design documents
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Backend server port |
| `NODE_ENV` | development | Environment mode |

## License

MIT
