# Implementation Plan: Cloud Native Todo Chatbot

**Branch**: `001-todo-chatbot` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-chatbot/spec.md`

## Summary

Build a full-stack Todo Chatbot application with React frontend and Node.js/Express backend, containerized with Docker and deployed to local Kubernetes (Minikube) using Helm charts. The application provides CRUD operations for todos via both a web UI and a conversational chatbot interface.

## Technical Context

**Language/Version**: Node.js 20.x (backend), TypeScript/React 18 (frontend)
**Primary Dependencies**: Express 4.x (backend), React 18 + Vite (frontend), nginx (frontend serving)
**Storage**: JSON file persistence (in-memory with file backup)
**Testing**: Jest (unit), manual verification (integration)
**Target Platform**: Kubernetes (Minikube) local cluster
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <2s CRUD operations, <3s chat response
**Constraints**: Frontend image <500MB, Backend image <300MB, Pod startup <30s
**Scale/Scope**: Single user, local development, hackathon demo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Container-First | Dockerfiles for all services | ✅ PASS | Multi-stage builds planned |
| II. Kubernetes-Native | Helm charts, health checks, replicas | ✅ PASS | 2 frontend, 1 backend replicas |
| III. Spec-Driven | Spec → Plan → Tasks workflow | ✅ PASS | Following workflow |
| IV. Infrastructure as Code | Helm values, ConfigMaps | ✅ PASS | No hardcoded config |
| V. Observability | Health endpoints, structured logs | ✅ PASS | /health endpoint, JSON logs |
| VI. Simplicity | Minimal viable implementation | ✅ PASS | No unnecessary complexity |

**Gate Status**: ✅ PASSED - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-chatbot/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup and deployment guide
├── contracts/
│   └── api.yaml         # OpenAPI specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (from /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── index.js           # Express app entry point
│   ├── routes/
│   │   ├── todos.js       # Todo CRUD routes
│   │   ├── chat.js        # Chat endpoint
│   │   └── health.js      # Health check route
│   ├── services/
│   │   ├── todoService.js # Todo business logic
│   │   └── chatService.js # Chat command parsing
│   ├── models/
│   │   └── todo.js        # Todo data model
│   └── utils/
│       └── logger.js      # Structured logging
├── data/
│   └── todos.json         # Persisted todos
├── package.json
├── Dockerfile
└── .dockerignore

frontend/
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── components/
│   │   ├── TodoList.jsx   # Todo list display
│   │   ├── TodoItem.jsx   # Single todo item
│   │   ├── TodoForm.jsx   # Add/edit todo form
│   │   └── ChatPanel.jsx  # Chat interface
│   ├── services/
│   │   └── api.js         # Backend API client
│   └── styles/
│       └── App.css        # Application styles
├── public/
│   └── index.html
├── package.json
├── vite.config.js
├── Dockerfile
├── nginx.conf
└── .dockerignore

helm/
└── todo-chatbot/
    ├── Chart.yaml
    ├── values.yaml
    ├── templates/
    │   ├── backend-deployment.yaml
    │   ├── backend-service.yaml
    │   ├── frontend-deployment.yaml
    │   ├── frontend-service.yaml
    │   └── configmap.yaml
    └── .helmignore
```

**Structure Decision**: Web application structure (Option 2) selected due to frontend + backend architecture requirement. Helm chart at repository root level for deployment.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Minikube Cluster                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Kubernetes Services                    │    │
│  │                                                          │    │
│  │  ┌──────────────────┐      ┌──────────────────────────┐ │    │
│  │  │ frontend-service │      │    backend-service       │ │    │
│  │  │   (NodePort)     │      │     (ClusterIP)          │ │    │
│  │  │   Port: 30080    │      │     Port: 3000           │ │    │
│  │  └────────┬─────────┘      └───────────┬──────────────┘ │    │
│  │           │                            │                 │    │
│  │  ┌────────▼─────────┐      ┌───────────▼──────────────┐ │    │
│  │  │   Frontend Pod   │      │     Backend Pod          │ │    │
│  │  │   (2 replicas)   │─────▶│     (1 replica)          │ │    │
│  │  │   nginx + React  │ HTTP │   Express + Node.js      │ │    │
│  │  └──────────────────┘      └──────────────────────────┘ │    │
│  │                                       │                  │    │
│  │                            ┌──────────▼──────────────┐  │    │
│  │                            │    todos.json (PV)      │  │    │
│  │                            │    (optional volume)    │  │    │
│  │                            └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
           │
           │ NodePort (30080)
           ▼
    ┌─────────────┐
    │   Browser   │
    │   (User)    │
    └─────────────┘
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check for K8s probes |
| GET | /todos | List all todos |
| POST | /todos | Create new todo |
| GET | /todos/:id | Get single todo |
| PUT | /todos/:id | Update todo |
| DELETE | /todos/:id | Delete todo |
| POST | /chat | Process chat message |

See [contracts/api.yaml](./contracts/api.yaml) for full OpenAPI specification.

## Chat Commands

| Command Pattern | Action | Response Example |
|-----------------|--------|------------------|
| `add <task>` | Create todo | "Created: Buy groceries" |
| `list` / `show` | List todos | "Your todos: 1. Buy groceries..." |
| `complete <n>` | Mark done | "Completed: Buy groceries" |
| `delete <n>` | Remove todo | "Deleted: Buy groceries" |
| `help` | Show commands | "Available commands: add, list..." |

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Container size exceeds spec | Medium | Low | Multi-stage builds, Alpine base |
| Minikube resource constraints | Low | Medium | Conservative resource limits |
| Chat parsing edge cases | Low | Medium | Clear help command, graceful fallback |
| Data persistence on pod restart | Medium | Medium | Volume mount option documented |

## Dependencies

### External Dependencies
- Node.js 20.x runtime
- Docker for containerization
- Minikube for local Kubernetes
- Helm for chart deployment

### Internal Dependencies
- Backend must be running before frontend API calls work
- Helm chart depends on Docker images being built first

## Next Steps

Run `/sp.tasks` to generate implementation tasks based on this plan.
