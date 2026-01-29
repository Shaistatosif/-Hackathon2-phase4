<!--
=== SYNC IMPACT REPORT ===
Version change: (new) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6): Container-First, Kubernetes-Native, Spec-Driven Development, Infrastructure as Code, Observability, Simplicity & Automation
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible - Constitution Check section present)
  - .specify/templates/spec-template.md ✅ (compatible - requirements structure present)
  - .specify/templates/tasks-template.md ✅ (compatible - phase structure present)
Follow-up TODOs: None
========================
-->

# Todo Chatbot Constitution

## Core Principles

### I. Container-First

All components MUST be containerized using Docker before deployment consideration.

- Every service (frontend, backend) MUST have a Dockerfile
- Container images MUST be built using multi-stage builds for minimal footprint
- Base images MUST use official, version-pinned images (no `latest` tags in production)
- All container configurations MUST be reproducible via build scripts
- AI tooling (Gordon) SHOULD assist Dockerfile generation but output MUST be reviewed

**Rationale**: Containers ensure environment consistency, enable horizontal scaling, and are prerequisite for Kubernetes orchestration.

### II. Kubernetes-Native

All deployments MUST target Kubernetes as the primary orchestration platform.

- Minikube MUST be the local development/testing platform
- Helm charts MUST define all Kubernetes resources (Deployments, Services, ConfigMaps)
- Resource requests and limits MUST be specified for all containers
- Health checks (liveness, readiness probes) MUST be defined for all services
- Replica counts: Frontend = 2, Backend = 1 (as specified)
- Service exposure: Frontend via NodePort, Backend internal-only unless explicitly required
- AI tooling (kubectl-ai) MAY assist with manifest generation but output MUST be validated

**Rationale**: Kubernetes provides self-healing, scaling, and declarative infrastructure management required for cloud-native applications.

### III. Spec-Driven Development

All implementation MUST follow the spec-driven workflow; no manual coding without specification.

- Feature work MUST begin with `/sp.specify` to create specification
- Implementation MUST follow `/sp.plan` then `/sp.tasks` workflow
- Code generation SHOULD leverage AI assistants (Claude, Gordon, kubectl-ai)
- All generated code MUST be reviewed against acceptance criteria before merge
- Changes without corresponding spec updates are NOT permitted

**Rationale**: Spec-driven development ensures traceability, reduces rework, and maintains alignment between intent and implementation.

### IV. Infrastructure as Code

All infrastructure configuration MUST be version-controlled and declarative.

- Helm values MUST define all environment-specific configuration
- Environment variables MUST be injected via ConfigMaps or Secrets (never hardcoded)
- Required environment variables:
  - Frontend: `FRONTEND_PORT`, `API_BASE_URL`
  - Backend: `BACKEND_PORT`, `ENV`
- Secrets MUST NOT be committed to version control; use `.env` files locally with `.gitignore`
- Infrastructure changes MUST go through the same review process as application code

**Rationale**: IaC enables reproducibility, auditability, and disaster recovery.

### V. Observability

All services MUST provide visibility into their operational state.

- Structured logging (JSON format) MUST be implemented for all services
- Health endpoints (`/health` or `/healthz`) MUST be exposed by backend services
- Container logs MUST be accessible via `kubectl logs`
- Error states MUST return meaningful messages (HTTP status codes + error bodies for APIs)
- Kubernetes events and pod status MUST be monitored during deployments

**Rationale**: Observability enables debugging, incident response, and operational confidence in distributed systems.

### VI. Simplicity & Automation

Prefer the simplest solution; automate repetitive tasks.

- YAGNI: Do not build features not explicitly required in the spec
- Smallest viable diff: Changes MUST be minimal and focused
- Build, test, and deploy commands SHOULD be single-command operations
- Manual steps in deployment MUST be documented and minimized
- Complexity MUST be justified in plan.md if it exceeds baseline expectations

**Rationale**: Simplicity reduces maintenance burden; automation reduces human error and accelerates delivery.

## Technology Constraints

### Stack Requirements

| Component | Technology | Version/Notes |
|-----------|------------|---------------|
| Frontend | React (or similar) | Must support SPA deployment |
| Backend | Node.js or Python | API exposing `/todos` and `/chat` endpoints |
| Containerization | Docker | Multi-stage builds preferred |
| Orchestration | Kubernetes (Minikube) | Local development cluster |
| Package Manager | Helm | Chart-based deployments |
| AI DevOps | Gordon, kubectl-ai | Dockerfile and manifest generation |

### API Contract

Backend MUST expose:
- `GET/POST /todos` - Todo CRUD operations
- `POST /chat` - Chatbot interaction endpoint

### Deployment Targets

- **Local Development**: Minikube with NodePort exposure
- **Production**: TODO(PRODUCTION_TARGET): Define when production environment is specified

## Development Workflow

### Feature Implementation Flow

1. **Specify**: Create feature spec via `/sp.specify`
2. **Plan**: Generate implementation plan via `/sp.plan`
3. **Tasks**: Break down into testable tasks via `/sp.tasks`
4. **Implement**: Execute tasks with AI assistance via `/sp.implement`
5. **Validate**: Test locally on Minikube cluster
6. **Document**: Update PHR and ADRs as needed

### Code Review Requirements

- All Dockerfiles MUST be reviewed for security (no secrets, minimal attack surface)
- All Helm charts MUST be validated (`helm lint`, `helm template`)
- All API changes MUST include updated endpoint documentation
- Generated code from AI tools MUST be reviewed before commit

### Quality Gates

- [ ] Containers build successfully
- [ ] Helm charts pass linting
- [ ] Services deploy to Minikube without errors
- [ ] Health checks pass for all deployed pods
- [ ] API endpoints respond correctly

## Governance

### Amendment Process

1. Propose change via PR with rationale
2. Update version according to semantic versioning:
   - MAJOR: Backward-incompatible principle changes
   - MINOR: New principles or significant expansions
   - PATCH: Clarifications and wording fixes
3. Update `LAST_AMENDED_DATE`
4. Ensure dependent templates remain compatible

### Compliance

- All PRs MUST verify compliance with constitution principles
- Constitution violations MUST be documented in Complexity Tracking (plan.md) with justification
- Periodic review: Constitution SHOULD be reviewed at project milestones

### Guidance Files

- Runtime development guidance: `CLAUDE.md`
- Feature specifications: `specs/<feature>/spec.md`
- Implementation plans: `specs/<feature>/plan.md`

**Version**: 1.0.0 | **Ratified**: 2026-01-21 | **Last Amended**: 2026-01-21
