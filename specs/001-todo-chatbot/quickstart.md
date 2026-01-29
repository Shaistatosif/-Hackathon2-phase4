# Quickstart: Cloud Native Todo Chatbot

**Feature**: 001-todo-chatbot
**Date**: 2026-01-21

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later
- **Docker** 24.x or later
- **Minikube** 1.32.x or later
- **Helm** 3.x or later
- **kubectl** 1.28.x or later

## Quick Verification

```bash
# Verify all tools are installed
node --version      # Should show v20.x.x
docker --version    # Should show Docker version 24.x.x
minikube version    # Should show minikube version 1.32.x
helm version        # Should show version.BuildInfo{Version:"v3.x.x"...}
kubectl version     # Should show client and server versions
```

## Option 1: Local Development (Without Kubernetes)

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start

# Backend runs at http://localhost:3000
```

### Frontend

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs at http://localhost:5173
```

### Verify Local Setup

```bash
# Test backend health
curl http://localhost:3000/health

# Test todo creation
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"description": "Test todo"}'

# Test chat
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "add Buy groceries"}'
```

## Option 2: Docker Containers (Without Kubernetes)

```bash
# Build images
docker build -t todo-frontend:local ./frontend
docker build -t todo-backend:local ./backend

# Create network
docker network create todo-network

# Run backend
docker run -d \
  --name todo-backend \
  --network todo-network \
  -p 3000:3000 \
  -e BACKEND_PORT=3000 \
  -e ENV=production \
  todo-backend:local

# Run frontend
docker run -d \
  --name todo-frontend \
  --network todo-network \
  -p 8080:80 \
  -e API_BASE_URL=http://todo-backend:3000 \
  todo-frontend:local

# Access at http://localhost:8080
```

### Cleanup Docker

```bash
docker stop todo-frontend todo-backend
docker rm todo-frontend todo-backend
docker network rm todo-network
```

## Option 3: Kubernetes Deployment (Minikube)

### Start Minikube

```bash
# Start cluster with sufficient resources
minikube start --cpus=2 --memory=4096

# Enable required addons
minikube addons enable ingress

# Point Docker to Minikube's daemon (important for local images)
eval $(minikube docker-env)
```

### Build Images in Minikube

```bash
# Build images inside Minikube's Docker daemon
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend
```

### Deploy with Helm

```bash
# Navigate to helm chart directory
cd helm/todo-chatbot

# Install the chart
helm install todo-chatbot . --namespace default

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
```

### Access the Application

```bash
# Get the NodePort URL
minikube service todo-frontend --url

# Or use port-forward
kubectl port-forward svc/todo-frontend 8080:80

# Access at http://localhost:8080
```

### Verify Kubernetes Deployment

```bash
# Check pod status
kubectl get pods

# Check services
kubectl get svc

# Check logs
kubectl logs -l app=todo-backend
kubectl logs -l app=todo-frontend

# Check health
kubectl exec -it $(kubectl get pod -l app=todo-backend -o jsonpath='{.items[0].metadata.name}') -- curl localhost:3000/health
```

### Cleanup Kubernetes

```bash
# Uninstall Helm release
helm uninstall todo-chatbot

# Stop Minikube (optional)
minikube stop
```

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| BACKEND_PORT | 3000 | Port for the API server |
| ENV | development | Environment mode |
| DATA_FILE | ./data/todos.json | Path to persistence file |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:3000 | Backend API URL |

## Chat Commands

Once the application is running, try these chat commands:

| Command | Example | Description |
|---------|---------|-------------|
| add | `add Buy groceries` | Create a new todo |
| list | `list` or `show todos` | Show all todos |
| complete | `complete 1` | Mark todo #1 as done |
| delete | `delete 1` | Remove todo #1 |
| help | `help` | Show available commands |

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Verify Node.js version: `node --version`

### Docker build fails
- Ensure Docker daemon is running: `docker info`
- Check Dockerfile syntax

### Minikube pods stuck in Pending
- Check resources: `kubectl describe pod <pod-name>`
- Verify Minikube has enough memory: `minikube config set memory 4096`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3000/health`
- Check CORS configuration
- In Kubernetes, verify service names match

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement backend API (P1)
3. Implement frontend UI (P1)
4. Add chat functionality (P2)
5. Create Dockerfiles (P4)
6. Create Helm charts (P3)
7. Deploy to Minikube and test
