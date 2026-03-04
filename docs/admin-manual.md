# DK HR 통합관리 - 운영자 매뉴얼

**문서 버전:** 1.0
**최종 수정일:** 2026-03-04
**대상:** 시스템 관리자 및 개발 운영팀

---

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [기술 스택](#2-기술-스택)
3. [설치 가이드](#3-설치-가이드)
4. [환경변수 설정](#4-환경변수-설정)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [데이터 관리](#6-데이터-관리)
7. [배포 가이드](#7-배포-가이드)
8. [유지보수 및 모니터링](#8-유지보수-및-모니터링)

---

## 1. 시스템 아키텍처

### 1.1 모노레포 구조

DK HR 통합관리 시스템은 **Turborepo + pnpm** 기반의 모노레포로 구성되어 있습니다. 단일 저장소에서 프론트엔드, 백엔드 API, ML 서비스 및 공유 패키지를 통합 관리합니다.

| 구성 요소 | 디렉토리 | 설명 |
|-----------|----------|------|
| 프론트엔드 | `apps/web` | Next.js 14 기반 대시보드 웹 애플리케이션 |
| 백엔드 API | `apps/api` | NestJS 기반 GraphQL API 서버 |
| ML 서비스 | `apps/ml-service` | Python 기반 머신러닝 예측 서비스 |
| 공유 패키지 | `packages/*` | 디자인 토큰, 타입, ESLint 설정, TypeScript 설정 |
| 인프라 | `infra/` | Docker, Kubernetes 배포 구성 |

### 1.2 프론트엔드: Next.js 14 App Router

프론트엔드 애플리케이션은 Next.js 14의 App Router를 사용합니다.

| 특성 | 설명 |
|------|------|
| 렌더링 방식 | 클라이언트 컴포넌트 위주 (대시보드 인터랙션) |
| 라우팅 | App Router 파일 기반 라우팅 |
| 라우트 그룹 | `(auth)` - 인증 페이지, `(dashboard)` - 대시보드 모듈 |
| 병렬 라우트 | `@kpi`, `@main`, `@insights` 슬롯으로 레이아웃 분할 |

### 1.3 백엔드 API: NestJS

백엔드는 NestJS 프레임워크 기반으로, GraphQL API를 제공합니다.

| 구성 요소 | 설명 |
|-----------|------|
| API 프레임워크 | NestJS 10 |
| API 형식 | GraphQL (Apollo Server) |
| 데이터베이스 ORM | Prisma |
| 인증 | Passport + JWT |
| 캐시 | Redis (ioredis) |
| 메시지 큐 | Kafka (kafkajs) |
| 실시간 통신 | Socket.io (WebSocket Gateway) |

### 1.4 ML 서비스

ML 서비스는 Python 기반의 독립 서비스로 예측 분석 기능을 제공합니다.

| 구성 요소 | 경로 | 설명 |
|-----------|------|------|
| API 엔드포인트 | `apps/ml-service/api/` | REST API 라우트 |
| 핵심 로직 | `apps/ml-service/core/` | 비즈니스 로직 |
| ML 모델 | `apps/ml-service/models/` | 학습된 모델 및 모델 정의 |
| 피처 스토어 | `apps/ml-service/feature_store/` | 피처 엔지니어링 |
| 스키마 | `apps/ml-service/schemas/` | 데이터 스키마 정의 |
| 진입점 | `apps/ml-service/main.py` | 서비스 진입점 |

### 1.5 공유 패키지

| 패키지 | 경로 | 설명 |
|--------|------|------|
| design-tokens | `packages/design-tokens` | 색상, 타이포그래피, 간격 등 디자인 토큰 |
| shared-types | `packages/shared-types` | 프론트엔드/백엔드 공유 TypeScript 타입 정의 |
| eslint-config | `packages/eslint-config` | 통합 ESLint 규칙 설정 |
| tsconfig | `packages/tsconfig` | 공유 TypeScript 컴파일러 설정 |

---

## 2. 기술 스택

### 2.1 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.2 | React 프레임워크 (App Router) |
| React | 18.2+ | UI 라이브러리 |
| TypeScript | 5.4+ | 정적 타입 시스템 |
| Tailwind CSS | 3.4+ | 유틸리티 기반 CSS 프레임워크 |
| Radix UI | 최신 | 접근성 준수 헤드리스 UI 컴포넌트 |
| ECharts | 5.5+ | 대시보드 차트 라이브러리 |
| echarts-for-react | 3.0+ | ECharts React 래퍼 |
| D3 | 7.9+ | 고급 데이터 시각화 (Sankey, 커스텀 차트) |
| d3-sankey | 0.12+ | Sankey 다이어그램 |
| Zustand | 4.5+ | 클라이언트 상태 관리 |
| React Query | 5.28+ | 서버 상태 관리 및 캐싱 |
| graphql-request | 6.1+ | 경량 GraphQL 클라이언트 |
| Socket.io Client | 4.7+ | 실시간 데이터 수신 |
| next-auth | 4.24+ | 인증 (OAuth, JWT) |
| Zod | 3.22+ | 스키마 검증 |
| react-hook-form | 7.51+ | 폼 관리 |
| date-fns | 3.6+ | 날짜 유틸리티 |
| Lucide React | 0.356+ | 아이콘 라이브러리 |
| clsx / tailwind-merge | 최신 | 조건부 CSS 클래스 합성 |

### 2.2 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 10.3+ | 서버 프레임워크 |
| Apollo Server | 4.10+ | GraphQL 서버 |
| Prisma | 5.10+ | 데이터베이스 ORM |
| Passport | 0.7+ | 인증 미들웨어 |
| passport-jwt | 4.0+ | JWT 전략 |
| ioredis | 5.3+ | Redis 클라이언트 |
| kafkajs | 2.2+ | Kafka 메시지 큐 클라이언트 |
| Socket.io | NestJS 연동 | WebSocket 실시간 통신 |
| bcrypt | 5.1+ | 비밀번호 해싱 |
| class-validator | 0.14+ | 입력 검증 |
| class-transformer | 0.5+ | 객체 변환 |
| rxjs | 7.8+ | 리액티브 프로그래밍 |

### 2.3 ML 서비스

| 기술 | 용도 |
|------|------|
| Python | ML 서비스 런타임 |
| FastAPI (추정) | REST API 서버 |
| scikit-learn / TensorFlow | 머신러닝 모델 |

### 2.4 개발 도구

| 도구 | 버전 | 용도 |
|------|------|------|
| Turborepo | 2.0+ | 모노레포 빌드 오케스트레이션 |
| pnpm | 9.0+ | 패키지 매니저 |
| Vitest | 1.4+ | 프론트엔드 단위 테스트 |
| Jest | 29.7+ | 백엔드 단위 테스트 |
| Testing Library | 14.2+ | React 컴포넌트 테스트 |
| ESLint | 8.57+ | 코드 린팅 |
| Prettier | 3.2+ | 코드 포매팅 |
| Husky | 9.0+ | Git 훅 관리 |
| lint-staged | 15.2+ | 스테이징된 파일 린팅 |
| commitlint | 19.0+ | 커밋 메시지 규칙 검증 |

### 2.5 인프라

| 기술 | 경로 | 용도 |
|------|------|------|
| Docker | `infra/docker/` | 컨테이너화 |
| Kubernetes | `infra/kubernetes/` | 컨테이너 오케스트레이션 |

---

## 3. 설치 가이드

### 3.1 사전 요구사항

| 요구사항 | 최소 버전 | 확인 명령어 |
|----------|-----------|-------------|
| Node.js | 20.0.0 이상 | `node --version` |
| pnpm | 9.0.0 이상 | `pnpm --version` |
| Git | 최신 | `git --version` |

### 3.2 pnpm 설치

pnpm이 설치되어 있지 않은 경우 다음 명령어로 설치합니다.

```bash
npm install -g pnpm@9
```

### 3.3 프로젝트 클론 및 의존성 설치

```bash
# 저장소 클론
git clone <repository-url> hr-dashboard
cd hr-dashboard

# 의존성 설치 (모노레포 전체)
pnpm install
```

### 3.4 개발 서버 실행

```bash
# 모든 앱 동시 실행 (Turborepo)
pnpm dev
```

개별 앱을 실행하려면 다음과 같이 합니다.

| 앱 | 명령어 | 기본 포트 |
|----|--------|-----------|
| 프론트엔드 (web) | `cd apps/web && pnpm dev` | 3000 |
| 백엔드 API | `cd apps/api && pnpm dev` | - |
| ML 서비스 | `cd apps/ml-service && python main.py` | - |

### 3.5 빌드

```bash
# 프로덕션 빌드 (모노레포 전체)
pnpm build
```

### 3.6 테스트 실행

```bash
# 전체 테스트
pnpm test

# 프론트엔드 테스트
cd apps/web && pnpm test

# 백엔드 테스트
cd apps/api && pnpm test
```

### 3.7 린팅

```bash
# 전체 린트
pnpm lint

# 코드 포매팅
pnpm format
```

### 3.8 데이터베이스 관리

| 명령어 | 설명 |
|--------|------|
| `pnpm db:migrate` | Prisma 마이그레이션 실행 |
| `pnpm db:seed` | 시드 데이터 삽입 |
| `pnpm db:studio` | Prisma Studio GUI 실행 |

---

## 4. 환경변수 설정

### 4.1 프론트엔드 환경변수 (apps/web)

프로젝트 루트 또는 `apps/web` 디렉토리에 `.env.local` 파일을 생성합니다.

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 URL | `http://localhost:4000/graphql` |
| `NEXT_PUBLIC_WS_URL` | WebSocket 서버 URL | `ws://localhost:4000` |
| `NEXTAUTH_URL` | NextAuth 콜백 URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 키 | 랜덤 문자열 |

### 4.2 백엔드 환경변수 (apps/api)

`apps/api` 디렉토리에 `.env` 파일을 생성합니다.

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://user:pass@localhost:5432/hr_db` |
| `REDIS_URL` | Redis 연결 문자열 | `redis://localhost:6379` |
| `JWT_SECRET` | JWT 토큰 서명 키 | 랜덤 문자열 |
| `JWT_EXPIRATION` | JWT 만료 시간 | `3600s` |
| `KAFKA_BROKERS` | Kafka 브로커 주소 | `localhost:9092` |

### 4.3 인증 관련 환경변수

| 변수명 | 설명 |
|--------|------|
| `OAUTH_CLIENT_ID` | OAuth 클라이언트 ID (SSO 사용 시) |
| `OAUTH_CLIENT_SECRET` | OAuth 클라이언트 시크릿 |
| `OAUTH_ISSUER` | OAuth 발급자 URL |

---

## 5. 프로젝트 구조

### 5.1 루트 디렉토리

```
hr-dashboard/
├── apps/                    # 애플리케이션 모음
│   ├── web/                 # 프론트엔드 (Next.js 14)
│   ├── api/                 # 백엔드 API (NestJS)
│   └── ml-service/          # ML 서비스 (Python)
├── packages/                # 공유 패키지
│   ├── design-tokens/       # 디자인 토큰
│   ├── shared-types/        # 공유 타입 정의
│   ├── eslint-config/       # ESLint 설정
│   └── tsconfig/            # TypeScript 설정
├── infra/                   # 인프라 구성
│   ├── docker/              # Docker 설정
│   └── kubernetes/          # Kubernetes 매니페스트
├── docs/                    # 문서
├── turbo.json               # Turborepo 설정
├── pnpm-workspace.yaml      # pnpm 워크스페이스 설정
├── package.json             # 루트 패키지 설정
├── tsconfig.json            # 루트 TypeScript 설정
├── commitlint.config.js     # 커밋 메시지 규칙
└── lint-staged.config.js    # lint-staged 설정
```

### 5.2 프론트엔드 구조 (apps/web/src)

```
apps/web/src/
├── app/                     # Next.js App Router 페이지
│   ├── (auth)/              # 인증 관련 페이지 (로그인 등)
│   ├── (dashboard)/         # 대시보드 페이지
│   │   ├── page.tsx         # 개요 대시보드
│   │   ├── layout.tsx       # 대시보드 레이아웃
│   │   ├── workforce/       # 인력현황 모듈
│   │   ├── recruitment/     # 채용 모듈
│   │   ├── performance/     # 성과관리 모듈
│   │   ├── development/     # 인재개발 모듈
│   │   ├── lifecycle/       # 라이프사이클 모듈
│   │   ├── culture/         # 조직문화 모듈
│   │   ├── dei/             # DEI 모듈
│   │   ├── reports/         # 리포트
│   │   └── settings/        # 설정
│   └── layout.tsx           # 루트 레이아웃
├── components/              # React 컴포넌트
│   ├── charts/              # 차트 컴포넌트
│   │   ├── echarts/         # ECharts 기반 차트
│   │   ├── d3/              # D3 기반 차트
│   │   ├── ChartContainer.tsx
│   │   ├── ChartSkeleton.tsx
│   │   ├── BubbleChart.tsx
│   │   ├── DonutChart.tsx
│   │   ├── FunnelChart.tsx
│   │   ├── GanttChart.tsx
│   │   ├── GaugeChart.tsx
│   │   ├── HeatmapChart.tsx
│   │   ├── LineWithBandChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── StackedBarChart.tsx
│   │   ├── TreemapChart.tsx
│   │   ├── WaterfallChart.tsx
│   │   └── WordCloud.tsx
│   ├── filters/             # 필터 컴포넌트
│   │   ├── DateRangePicker.tsx
│   │   ├── DepartmentSelect.tsx
│   │   ├── FilterChips.tsx
│   │   └── FilterPanel.tsx
│   ├── kpi/                 # KPI 카드 컴포넌트
│   │   ├── KpiCard.tsx
│   │   ├── KpiGrid.tsx
│   │   └── KpiSignal.tsx
│   ├── layout/              # 레이아웃 컴포넌트
│   │   ├── DashboardShell.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── ui/                  # 기본 UI 컴포넌트 (Radix 기반)
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Dialog.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Skeleton.tsx
│       ├── Table.tsx
│       ├── Tabs.tsx
│       ├── Toast.tsx
│       └── Tooltip.tsx
├── constants/               # 상수 정의
│   └── tooltips.ts          # 풍선도움말 텍스트
├── graphql/                 # GraphQL 관련
│   ├── queries/             # GraphQL 쿼리
│   ├── mutations/           # GraphQL 뮤테이션
│   ├── subscriptions/       # GraphQL 서브스크립션
│   ├── fragments/           # GraphQL 프래그먼트
│   └── index.ts             # GraphQL 클라이언트 설정
├── hooks/                   # 커스텀 훅
│   ├── useChartResize.ts    # 차트 리사이즈 훅
│   ├── useDashboardData.ts  # 대시보드 데이터 페칭 훅
│   ├── useDrilldown.ts      # 드릴다운 네비게이션 훅
│   ├── useFilterState.ts    # 필터 상태 관리 훅
│   ├── useMediaQuery.ts     # 반응형 미디어 쿼리 훅
│   ├── useRealtimeData.ts   # 실시간 데이터 훅
│   └── useViewPermission.ts # 뷰 권한 훅
├── lib/                     # 유틸리티 함수
├── mocks/                   # Mock 데이터 (개발용)
├── providers/               # React Context Providers
├── queries/                 # React Query 쿼리 정의
├── stores/                  # Zustand 스토어
│   ├── drilldownStore.ts    # 드릴다운 상태
│   ├── filterStore.ts       # 필터 상태
│   ├── notificationStore.ts # 알림 상태
│   └── viewStore.ts         # 뷰 상태 (사이드바 등)
├── styles/                  # 글로벌 스타일
└── types/                   # TypeScript 타입 정의
    ├── api.ts
    ├── auth.ts
    ├── chart.ts
    ├── d3-sankey.d.ts
    ├── dashboard.ts
    ├── filter.ts
    └── kpi.ts
```

### 5.3 백엔드 구조 (apps/api/src)

```
apps/api/src/
├── main.ts                  # 애플리케이션 진입점
├── app.module.ts            # 루트 모듈
├── config/                  # 설정 모듈
├── gateway/                 # WebSocket 게이트웨이
├── modules/                 # 기능 모듈
└── shared/                  # 공유 모듈 (가드, 필터 등)
```

### 5.4 각 대시보드 모듈의 구조

각 대시보드 모듈(workforce, recruitment 등)은 병렬 라우트 패턴을 사용합니다.

```
(dashboard)/[module]/
├── layout.tsx               # 모듈 레이아웃 (병렬 라우트 슬롯 배치)
├── loading.tsx              # 로딩 UI
├── page.tsx                 # 모듈 메인 페이지
├── @kpi/                    # KPI 카드 슬롯
├── @main/                   # 메인 차트 슬롯
└── @insights/               # 인사이트 슬롯
```

---

## 6. 데이터 관리

### 6.1 GraphQL 쿼리/뮤테이션 구조

프론트엔드는 `graphql-request`를 사용하여 백엔드 GraphQL API와 통신합니다.

| 디렉토리 | 경로 | 설명 |
|----------|------|------|
| 쿼리 | `src/graphql/queries/` | 데이터 조회용 GraphQL 쿼리 |
| 뮤테이션 | `src/graphql/mutations/` | 데이터 변경용 GraphQL 뮤테이션 |
| 서브스크립션 | `src/graphql/subscriptions/` | 실시간 데이터 구독 |
| 프래그먼트 | `src/graphql/fragments/` | 재사용 가능한 쿼리 프래그먼트 |

**데이터 페칭 흐름:**

| 단계 | 구성 요소 | 설명 |
|------|-----------|------|
| 1 | React Query 훅 | `src/hooks/useDashboardData.ts`에서 쿼리 호출 |
| 2 | GraphQL 클라이언트 | `src/graphql/index.ts`의 graphql-request 클라이언트 |
| 3 | NestJS Resolver | 백엔드에서 쿼리 처리 |
| 4 | Prisma ORM | 데이터베이스 쿼리 실행 |

### 6.2 Mock 데이터 (개발 환경)

개발 환경에서는 `src/mocks/` 디렉토리의 Mock 데이터를 사용합니다.

- Mock 데이터는 실제 API 응답 형태와 동일한 구조로 구성되어 있습니다.
- 개발 중 API 서버 없이도 UI 개발 및 테스트가 가능합니다.

### 6.3 실시간 데이터 (Socket.io)

실시간 데이터는 Socket.io를 통해 WebSocket 연결로 수신합니다.

| 구성 요소 | 역할 |
|-----------|------|
| `useRealtimeData.ts` 훅 | 클라이언트 측 실시간 데이터 구독 |
| `apps/api/src/gateway/` | 서버 측 WebSocket 게이트웨이 |
| NestJS Platform Socket.io | WebSocket 플랫폼 모듈 |

### 6.4 상태 관리

| 상태 유형 | 도구 | 스토어 |
|-----------|------|--------|
| 서버 상태 | React Query | 자동 캐싱, 리프레시 |
| 클라이언트 상태 | Zustand | filterStore, viewStore, notificationStore, drilldownStore |
| 폼 상태 | react-hook-form | 설정 등 폼 입력 관리 |

---

## 7. 배포 가이드

### 7.1 프로덕션 빌드

```bash
# 전체 빌드
pnpm build

# 프론트엔드만 빌드
cd apps/web && pnpm build

# 백엔드만 빌드
cd apps/api && pnpm build
```

### 7.2 Docker 배포

인프라 설정은 `infra/docker/` 디렉토리에 위치합니다.

| 단계 | 명령어 | 설명 |
|------|--------|------|
| 1 | Docker 이미지 빌드 | `docker build` 실행 |
| 2 | 컨테이너 실행 | `docker-compose up` 실행 |
| 3 | 환경변수 설정 | `.env` 파일 또는 Docker 환경변수로 설정 |

### 7.3 Kubernetes 배포

Kubernetes 매니페스트는 `infra/kubernetes/` 디렉토리에 위치합니다.

| 단계 | 설명 |
|------|------|
| 1 | Kubernetes 클러스터에 네임스페이스 생성 |
| 2 | ConfigMap 및 Secret 생성 (환경변수) |
| 3 | Deployment, Service, Ingress 매니페스트 적용 |
| 4 | 헬스체크 및 로드밸런싱 확인 |

### 7.4 빌드 출력

| 앱 | 빌드 출력 경로 | 설명 |
|----|----------------|------|
| web | `apps/web/.next/` | Next.js 빌드 아티팩트 |
| api | `apps/api/dist/` | NestJS 컴파일된 JavaScript |

### 7.5 Turborepo 빌드 캐시

Turborepo는 빌드 결과를 캐싱하여 변경되지 않은 패키지의 빌드를 건너뜁니다.

| 설정 | 파일 | 설명 |
|------|------|------|
| 빌드 태스크 | `turbo.json` | 태스크 종속성 및 출력 경로 정의 |
| 캐시 출력 | `.next/**`, `dist/**` | 캐시 대상 빌드 출력 |
| 글로벌 종속성 | `**/.env.*local` | 환경변수 변경 시 캐시 무효화 |

---

## 8. 유지보수 및 모니터링

### 8.1 로그 관리

| 로그 유형 | 위치 | 설명 |
|-----------|------|------|
| 프론트엔드 | 브라우저 콘솔 | React 에러, API 호출 로그 |
| 백엔드 | 서버 stdout | NestJS 요청/응답 로그 |
| 데이터베이스 | Prisma 로그 | 쿼리 실행 로그 |

### 8.2 헬스체크

| 서비스 | 엔드포인트 | 설명 |
|--------|-----------|------|
| 프론트엔드 | `/` | Next.js 응답 확인 |
| 백엔드 API | `/graphql` | GraphQL Playground 접근 확인 |
| 데이터베이스 | Prisma 연결 확인 | DB 연결 상태 확인 |
| Redis | 연결 상태 확인 | 캐시 서버 상태 확인 |

### 8.3 데이터베이스 유지보수

| 작업 | 명령어 | 설명 |
|------|--------|------|
| 마이그레이션 실행 | `pnpm db:migrate` | 스키마 변경사항 적용 |
| 시드 데이터 삽입 | `pnpm db:seed` | 초기 데이터 생성 |
| DB 관리 GUI | `pnpm db:studio` | Prisma Studio로 데이터 관리 |
| Prisma 클라이언트 생성 | `cd apps/api && pnpm prisma:generate` | Prisma 클라이언트 재생성 |

### 8.4 의존성 업데이트

| 단계 | 명령어 | 설명 |
|------|--------|------|
| 1 | `pnpm outdated` | 업데이트 가능한 패키지 확인 |
| 2 | `pnpm update` | 패키지 업데이트 |
| 3 | `pnpm test` | 업데이트 후 테스트 실행 |
| 4 | `pnpm build` | 빌드 정상 여부 확인 |

### 8.5 코드 품질 관리

| 도구 | 명령어 | 설명 |
|------|--------|------|
| ESLint | `pnpm lint` | 코드 규칙 위반 검사 |
| Prettier | `pnpm format` | 코드 포매팅 |
| commitlint | 자동 (Git Hook) | 커밋 메시지 규칙 검증 |
| lint-staged | 자동 (Git Hook) | 커밋 전 변경 파일 린팅 |
| TypeScript | `tsc --noEmit` | 타입 오류 검사 |

### 8.6 장애 대응

| 증상 | 확인 항목 | 조치 |
|------|-----------|------|
| 페이지 로딩 실패 | 프론트엔드 서버 상태, 빌드 오류 | 서버 재시작, 빌드 로그 확인 |
| 데이터 미표시 | API 서버 상태, DB 연결 | API 로그 확인, DB 연결 확인 |
| 실시간 업데이트 안 됨 | WebSocket 연결, Redis 상태 | Socket.io 연결 확인, Redis 재시작 |
| 인증 오류 | JWT 토큰, 세션, 환경변수 | 토큰 만료 확인, NEXTAUTH_SECRET 확인 |
| 느린 응답 | DB 쿼리 성능, 캐시 적중률 | Prisma 쿼리 최적화, Redis 캐시 확인 |

---

*DK HR 통합관리 시스템 - 운영자 매뉴얼 v1.0*
