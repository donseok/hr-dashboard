# HR Analytics Dashboard

Enterprise-grade HR analytics platform with real-time dashboards, ML-powered predictions, and comprehensive workforce insights.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, ECharts |
| Backend API | NestJS 10, GraphQL (Apollo), Prisma ORM |
| ML Service | Python FastAPI, XGBoost, LightGBM, KoBERT (sim) |
| Database | PostgreSQL 16 (TimescaleDB) |
| Cache | Redis 7 |
| Messaging | Apache Kafka |
| Search | Elasticsearch 8 |
| Infra | Docker Compose, Kubernetes, GitHub Actions CI/CD |
| Monorepo | Turborepo, pnpm workspaces |

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose
- Python >= 3.11 (for ML service)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/hr-dashboard.git
cd hr-dashboard
pnpm install
```

### 2. Start Infrastructure

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

This starts PostgreSQL, Redis, Kafka, and Elasticsearch.

### 3. Database Setup

```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
cd ../..
```

### 4. Start Development Servers

```bash
# All services (web + api)
pnpm dev

# ML service (separate terminal)
cd apps/ml-service
pip install -r requirements.txt
python main.py
```

| Service | URL |
|---------|-----|
| Web Dashboard | http://localhost:3000 |
| GraphQL API | http://localhost:4000/graphql |
| ML Service | http://localhost:8000/docs |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| HR Specialist | hr@company.com | hr123 |
| Manager | manager@company.com | manager123 |
| Executive | exec@company.com | exec123 |

## Project Structure

```
hr-dashboard/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   └── src/
│   │       ├── app/            # App Router pages (7 modules)
│   │       ├── components/     # UI + chart components (16 chart types)
│   │       ├── graphql/        # GraphQL client & operations
│   │       ├── queries/        # React Query hooks
│   │       ├── stores/         # Zustand state management
│   │       └── types/          # TypeScript type definitions
│   ├── api/                    # NestJS backend
│   │   ├── prisma/             # Schema (21 models) & seed data (55 employees)
│   │   └── src/
│   │       ├── gateway/        # GraphQL schema & auth guards
│   │       ├── modules/        # 7 domain modules
│   │       │   ├── recruitment/
│   │       │   ├── workforce/
│   │       │   ├── performance/
│   │       │   ├── culture/
│   │       │   ├── development/
│   │       │   ├── dei/
│   │       │   └── lifecycle/
│   │       └── shared/         # Prisma, audit, auth services
│   └── ml-service/             # Python FastAPI ML service
│       ├── models/
│       │   ├── attrition/      # XGBoost employee attrition prediction
│       │   ├── recruitment/    # LightGBM candidate fit scoring
│       │   └── sentiment/     # Korean sentiment analysis (KoBERT sim)
│       ├── feature_store/      # Redis + PostgreSQL feature pipeline
│       ├── api/routes/         # Prediction & model info endpoints
│       └── schemas/            # Pydantic request/response models
├── packages/
│   ├── design-tokens/          # Shared design tokens
│   ├── shared-types/           # Cross-app TypeScript types
│   ├── eslint-config/          # Shared ESLint config
│   └── tsconfig/               # Shared TypeScript config
├── infra/
│   ├── docker/                 # Docker Compose (PostgreSQL, Redis, Kafka, ES)
│   └── kubernetes/             # K8s manifests (Kustomize)
│       ├── base/               # Base resources
│       └── overlays/           # staging / production overrides
└── .github/workflows/          # CI/CD pipelines
```

## Modules

| Module | Description | Key Features |
|--------|-------------|-------------|
| Recruitment | Hiring pipeline analytics | Funnel, source effectiveness, time-to-hire, ML candidate fit |
| Workforce | Headcount & org analytics | Department distribution, turnover trend, demographics |
| Performance | Review & rating analytics | Rating distribution, bell curve, goal completion |
| Culture | Engagement & sentiment | eNPS, survey participation, sentiment analysis |
| Development | L&D analytics | Skill gaps, training completion, internal mobility |
| DEI | Diversity & inclusion | Gender distribution, pay equity, inclusion score |
| Lifecycle | Cross-module insights | Employee journey, attrition correlation, module KPI summary |

## Environment Variables

### API (`apps/api`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://hr_admin:hr_password@localhost:5432/hr_dashboard` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `KAFKA_BROKERS` | Kafka broker addresses | `localhost:9092` |
| `ELASTICSEARCH_URL` | Elasticsearch URL | `http://localhost:9200` |

### ML Service (`apps/ml-service`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL (read-only) | `postgresql://hr_admin:hr_password@localhost:5432/hr_dashboard` |
| `REDIS_URL` | Redis for feature cache | `redis://localhost:6379` |
| `CORS_ORIGINS` | Allowed origins | `["http://localhost:3000"]` |

## Development Guide

### Adding a New Module

1. Create Prisma models in `apps/api/prisma/schema.prisma`
2. Add GraphQL types to `apps/api/src/gateway/graphql/schema.gql`
3. Create `apps/api/src/modules/<name>/` with repository, service, resolver, module files
4. Register in `apps/api/src/app.module.ts`
5. Create frontend page at `apps/web/src/app/(dashboard)/<name>/page.tsx`

### Adding a Chart Component

1. Create component in `apps/web/src/components/charts/`
2. Use ECharts via `echarts-for-react` with the standard chart wrapper pattern
3. Import design tokens from `@hr-dashboard/design-tokens`

### Adding an ML Prediction Endpoint

1. Define Pydantic schemas in `apps/ml-service/schemas/prediction.py`
2. Create model class in `apps/ml-service/models/<name>/model.py`
3. Add route handler in `apps/ml-service/api/routes/prediction.py`
4. Register model in `apps/ml-service/main.py` model registry

## Deployment

### Staging (automatic)

Merging to `main` triggers the staging CD pipeline:

```
PR merged → Docker build → GHCR push → K8s rollout (staging)
```

### Production (manual approval)

Creating a release tag triggers production deployment:

```bash
git tag v1.0.0
git push origin v1.0.0
# → Docker build → GHCR push → Manual approval → K8s rollout (production)
```

### Kubernetes

```bash
# Staging
kubectl apply -k infra/kubernetes/overlays/staging

# Production
kubectl apply -k infra/kubernetes/overlays/production
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run all tests |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Prisma Studio |

## License

MIT
