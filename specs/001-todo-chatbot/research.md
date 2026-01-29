# Research: Cloud Native Todo Chatbot

**Feature**: 001-todo-chatbot
**Date**: 2026-01-21
**Status**: Complete

## Technology Stack Decisions

### Frontend Framework

**Decision**: React 18 with Vite
**Rationale**:
- React is explicitly mentioned in the spec as the frontend choice
- Vite provides fast build times and excellent developer experience
- Small bundle size suitable for container deployment
- Wide ecosystem support for chat UI components

**Alternatives Considered**:
- Vue.js: Good option but React explicitly mentioned in requirements
- Next.js: Overkill for SPA; adds server complexity not needed
- Plain HTML/JS: Would work but lacks component reusability

### Backend Framework

**Decision**: Node.js with Express
**Rationale**:
- Node.js mentioned in spec as option (Node.js/Python)
- Express is minimal, well-documented, and fast to implement
- JSON handling is native to JavaScript
- Easy to implement REST endpoints and chat logic
- Smaller container image than Python alternatives

**Alternatives Considered**:
- Python/FastAPI: Good option but Node.js allows frontend/backend JS consistency
- Python/Flask: Similar to Express but adds language context switch
- Deno: Too new, fewer deployment resources

### Storage Strategy

**Decision**: In-memory storage with JSON file persistence
**Rationale**:
- Spec explicitly states "In-memory or file-based storage is acceptable"
- Hackathon scope doesn't require database complexity
- JSON file provides persistence across restarts
- Easy to upgrade to database later if needed

**Alternatives Considered**:
- SQLite: Adds dependency; overkill for hackathon
- Redis: Adds infrastructure complexity
- PostgreSQL: Requires additional container; out of scope

### Container Strategy

**Decision**: Multi-stage Docker builds with Alpine base images
**Rationale**:
- Constitution mandates multi-stage builds
- Alpine images minimize attack surface and size
- Node 20-alpine for both frontend build and backend runtime
- nginx:alpine for frontend serving

**Image Size Targets**:
- Frontend: < 50MB (nginx + static files)
- Backend: < 150MB (node-alpine + dependencies)

### Helm Chart Structure

**Decision**: Single Helm chart with subcharts for frontend/backend
**Rationale**:
- Simplifies deployment with single `helm install`
- Allows independent configuration via values
- Follows Kubernetes best practices

**Chart Components**:
- Deployment: frontend (2 replicas), backend (1 replica)
- Service: frontend (NodePort), backend (ClusterIP)
- ConfigMap: environment variables
- Health checks: liveness and readiness probes

### Chat Command Parsing

**Decision**: Rule-based regex parsing
**Rationale**:
- Spec states "Chatbot uses rule-based command parsing (no AI/ML integration)"
- Simple pattern matching for commands: add, list, complete, delete, help
- Extensible for future commands

**Command Patterns**:
- `add <task>` or `create <task>` → Create todo
- `list` or `show` or `todos` → List all todos
- `complete <id>` or `done <id>` → Mark complete
- `delete <id>` or `remove <id>` → Delete todo
- `help` → Show available commands

## Infrastructure Decisions

### Kubernetes Resources

**Decision**: Standard Deployment + Service pattern
**Rationale**:
- Simple, well-understood pattern
- Supports replica scaling
- Easy health check configuration

**Resource Limits**:
- Frontend: 128Mi memory, 100m CPU (per replica)
- Backend: 256Mi memory, 200m CPU

### Service Exposure

**Decision**: Frontend via NodePort (30080), Backend via ClusterIP
**Rationale**:
- NodePort allows external access without LoadBalancer
- Backend only needs internal cluster communication
- Minikube compatible

### Health Checks

**Decision**: HTTP GET probes
**Rationale**:
- Standard Kubernetes pattern
- Easy to implement in both frontend and backend

**Endpoints**:
- Frontend: GET / (nginx default)
- Backend: GET /health

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| Which frontend framework? | React 18 + Vite |
| Which backend runtime? | Node.js + Express |
| How to persist data? | JSON file storage |
| How to structure Helm charts? | Single chart with subcharts |
| What base images to use? | node:20-alpine, nginx:alpine |
| How to parse chat commands? | Regex-based pattern matching |

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Container size exceeds spec | Multi-stage builds + Alpine images |
| Chat parsing edge cases | Clear help command + graceful fallback |
| Data loss on pod restart | Volume mount for JSON file (optional) |
| Minikube resource limits | Conservative resource requests |
