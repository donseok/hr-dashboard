# HR Dashboard 프로젝트 폴더 구조 설계

> **작성일**: 2026-03-03
> **작성자**: 프로젝트 리더 (PM 장기획, FE 최화면, BE 서버든, UX 한디자 설계 문서 기반)
> **상태**: 검토 대기

---

## 개요

- **모노레포**: Turborepo + pnpm workspace
- **앱 3개**: web (Next.js 14), api (NestJS), ml-service (FastAPI)
- **공유 패키지 4개**: shared-types, design-tokens, eslint-config, tsconfig
- **7대 대시보드 모듈**: 채용, 인력운영, 성과, 조직문화, 인재개발, DEI, 통합 라이프사이클

---

## 전체 트리 구조

```
hr-dashboard/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                          # PR 검증 (lint, test, build)
│   │   ├── cd-staging.yml                  # Staging 배포
│   │   ├── cd-production.yml               # Production 배포
│   │   ├── ml-pipeline.yml                 # ML 모델 학습/배포
│   │   └── codeql-analysis.yml             # 보안 스캔
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── kpi_request.md                  # KPI 추가 요청 템플릿
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── apps/
│   │
│   ├── web/                                # ========== 프론트엔드 (Next.js 14) ==========
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   │   ├── pretendard/             # 한글 본문
│   │   │   │   ├── inter/                  # 영문/숫자
│   │   │   │   └── jetbrains-mono/         # 코드/수치
│   │   │   ├── icons/
│   │   │   └── images/
│   │   │
│   │   ├── src/
│   │   │   ├── app/                        # ---- App Router ----
│   │   │   │   ├── (auth)/                 # 인증 라우트 그룹
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   │
│   │   │   │   ├── (dashboard)/            # 대시보드 라우트 그룹
│   │   │   │   │   ├── layout.tsx          # 공통 레이아웃 (사이드바+헤더)
│   │   │   │   │   ├── page.tsx            # 메인 대시보드 (통합 뷰)
│   │   │   │   │   │
│   │   │   │   │   ├── recruitment/        # [모듈1] 채용 분석
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx  # 메인 차트 영역
│   │   │   │   │   │   ├── @kpi/page.tsx   # KPI 스코어카드
│   │   │   │   │   │   ├── @insights/page.tsx # AI 인사이트 패널
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── workforce/          # [모듈2] 인력 운영
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx
│   │   │   │   │   │   ├── @kpi/page.tsx
│   │   │   │   │   │   ├── @insights/page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── performance/        # [모듈3] 성과 관리
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx
│   │   │   │   │   │   ├── @kpi/page.tsx
│   │   │   │   │   │   ├── @insights/page.tsx
│   │   │   │   │   │   ├── calibration/    # 캘리브레이션 시뮬레이터
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── culture/            # [모듈4] 조직문화/몰입도
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx
│   │   │   │   │   │   ├── @kpi/page.tsx
│   │   │   │   │   │   ├── @insights/page.tsx
│   │   │   │   │   │   ├── pulse/          # Culture Pulse AI
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── development/        # [모듈5] 인재개발
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx
│   │   │   │   │   │   ├── @kpi/page.tsx
│   │   │   │   │   │   ├── @insights/page.tsx
│   │   │   │   │   │   ├── journey/        # Growth Journey Map
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── dei/                # [모듈6] DEI
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── @main/page.tsx
│   │   │   │   │   │   ├── @kpi/page.tsx
│   │   │   │   │   │   ├── @insights/page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── lifecycle/          # [모듈7] 통합 라이프사이클 뷰
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── reports/            # 커스텀 리포트
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [reportId]/page.tsx
│   │   │   │   │   │
│   │   │   │   │   └── settings/           # 대시보드 설정
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── api/                    # API Routes (BFF)
│   │   │   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   │   │   └── graphql/route.ts
│   │   │   │   │
│   │   │   │   ├── layout.tsx              # 루트 레이아웃
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── error.tsx
│   │   │   │
│   │   │   ├── components/                 # ---- 컴포넌트 ----
│   │   │   │   ├── layout/                 # 레이아웃
│   │   │   │   │   ├── Sidebar/
│   │   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   │   ├── SidebarNav.tsx
│   │   │   │   │   │   ├── SidebarFooter.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Header/
│   │   │   │   │   │   ├── Header.tsx
│   │   │   │   │   │   ├── UserMenu.tsx
│   │   │   │   │   │   ├── NotificationBell.tsx
│   │   │   │   │   │   ├── GlobalSearch.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── DashboardShell.tsx
│   │   │   │   │   └── PageContainer.tsx
│   │   │   │   │
│   │   │   │   ├── charts/                 # 차트 (16종)
│   │   │   │   │   ├── echarts/            # ECharts 기반 (11종)
│   │   │   │   │   │   ├── FunnelChart.tsx          # 퍼널 (채용)
│   │   │   │   │   │   ├── LineWithBandChart.tsx     # 라인+밴드 (추세)
│   │   │   │   │   │   ├── HeatmapChart.tsx          # 히트맵 (이직률)
│   │   │   │   │   │   ├── GaugeChart.tsx            # 게이지 (목표달성)
│   │   │   │   │   │   ├── StackedBarChart.tsx       # 스택드바
│   │   │   │   │   │   ├── TreemapChart.tsx          # 트리맵 (인력구조)
│   │   │   │   │   │   ├── WaterfallChart.tsx        # 워터폴 (인원변동)
│   │   │   │   │   │   ├── RadarChart.tsx            # 레이더/스파이더
│   │   │   │   │   │   ├── DonutChart.tsx            # 도넛
│   │   │   │   │   │   ├── BubbleChart.tsx           # 버블
│   │   │   │   │   │   └── GanttChart.tsx            # 간트
│   │   │   │   │   ├── d3/                 # D3.js 기반 (4종)
│   │   │   │   │   │   ├── SankeyDiagram.tsx         # 산키 (인재흐름)
│   │   │   │   │   │   ├── NineBoxGrid.tsx           # 9-Box Grid (성과)
│   │   │   │   │   │   ├── CohortHeatmap.tsx         # 코호트 히트맵
│   │   │   │   │   │   └── InteractiveTimeline.tsx   # 인터랙티브 타임라인
│   │   │   │   │   ├── custom/             # 커스텀 (1종)
│   │   │   │   │   │   └── WordCloud.tsx             # 워드클라우드 (감성)
│   │   │   │   │   ├── ChartContainer.tsx  # 공통 차트 컨테이너
│   │   │   │   │   ├── ChartToolbar.tsx    # 차트 툴바
│   │   │   │   │   ├── ChartSkeleton.tsx   # 로딩 스켈레톤
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── kpi/                    # KPI 스코어카드
│   │   │   │   │   ├── KpiCard.tsx
│   │   │   │   │   ├── KpiGrid.tsx
│   │   │   │   │   ├── KpiTrend.tsx
│   │   │   │   │   ├── KpiSignal.tsx       # 신호등 표시기
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── filters/               # 필터
│   │   │   │   │   ├── FilterPanel.tsx
│   │   │   │   │   ├── DateRangePicker.tsx
│   │   │   │   │   ├── DepartmentSelect.tsx
│   │   │   │   │   ├── EmployeeTypeFilter.tsx
│   │   │   │   │   ├── FilterChips.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── drilldown/             # 드릴다운
│   │   │   │   │   ├── DrilldownBreadcrumb.tsx
│   │   │   │   │   ├── DrilldownPanel.tsx
│   │   │   │   │   ├── DrilldownTable.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── ai/                    # AI 인사이트
│   │   │   │   │   ├── InsightPanel.tsx
│   │   │   │   │   ├── PredictionCard.tsx
│   │   │   │   │   ├── RecommendationList.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── notifications/         # 알림
│   │   │   │   │   ├── NotificationToast.tsx
│   │   │   │   │   ├── NotificationCenter.tsx
│   │   │   │   │   ├── AlertBanner.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── ui/                    # 기본 UI (Radix UI 래퍼)
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Dialog.tsx
│   │   │   │       ├── Dropdown.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       ├── Select.tsx
│   │   │   │       ├── Table.tsx           # TanStack Table 래퍼
│   │   │   │       ├── Tabs.tsx
│   │   │   │       ├── Tooltip.tsx
│   │   │   │       ├── Badge.tsx
│   │   │   │       ├── Avatar.tsx
│   │   │   │       ├── Skeleton.tsx
│   │   │   │       ├── Card.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── hooks/                     # ---- 커스텀 훅 ----
│   │   │   │   ├── useChartResize.ts
│   │   │   │   ├── useDrilldown.ts
│   │   │   │   ├── useFilterState.ts
│   │   │   │   ├── useRealtimeData.ts      # WebSocket 실시간
│   │   │   │   ├── useViewPermission.ts    # RBAC 뷰 권한
│   │   │   │   ├── useKpiData.ts
│   │   │   │   ├── useExport.ts
│   │   │   │   └── useMediaQuery.ts
│   │   │   │
│   │   │   ├── stores/                    # ---- Zustand 스토어 ----
│   │   │   │   ├── filterStore.ts
│   │   │   │   ├── drilldownStore.ts
│   │   │   │   ├── viewStore.ts
│   │   │   │   └── notificationStore.ts
│   │   │   │
│   │   │   ├── lib/                       # ---- 유틸리티 ----
│   │   │   │   ├── chart-config/
│   │   │   │   │   ├── echarts-theme.ts
│   │   │   │   │   ├── chart-registry.ts
│   │   │   │   │   └── chart-options.ts
│   │   │   │   ├── color-system.ts         # 신호등 컬러 시스템
│   │   │   │   ├── data-transformers.ts
│   │   │   │   ├── drill-path.ts
│   │   │   │   ├── format.ts
│   │   │   │   ├── graphql-client.ts
│   │   │   │   └── auth.ts
│   │   │   │
│   │   │   ├── types/                     # ---- TypeScript 타입 ----
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── chart.ts
│   │   │   │   ├── filter.ts
│   │   │   │   ├── kpi.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── auth.ts
│   │   │   │
│   │   │   ├── styles/                    # ---- 스타일 ----
│   │   │   │   ├── globals.css
│   │   │   │   ├── chart.module.css
│   │   │   │   └── dashboard.module.css
│   │   │   │
│   │   │   └── graphql/                   # ---- GraphQL 쿼리 ----
│   │   │       ├── queries/
│   │   │       │   ├── recruitment.ts
│   │   │       │   ├── workforce.ts
│   │   │       │   ├── performance.ts
│   │   │       │   ├── culture.ts
│   │   │       │   ├── development.ts
│   │   │       │   ├── dei.ts
│   │   │       │   └── lifecycle.ts
│   │   │       ├── mutations/
│   │   │       │   ├── filters.ts
│   │   │       │   └── reports.ts
│   │   │       ├── subscriptions/
│   │   │       │   ├── notifications.ts
│   │   │       │   └── realtime-kpi.ts
│   │   │       └── fragments/
│   │   │           ├── kpi.ts
│   │   │           └── employee.ts
│   │   │
│   │   ├── __tests__/                     # 테스트
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── e2e/
│   │   │       ├── dashboard.spec.ts
│   │   │       ├── drilldown.spec.ts
│   │   │       └── auth.spec.ts
│   │   │
│   │   ├── .storybook/                    # Storybook
│   │   │   ├── main.ts
│   │   │   └── preview.ts
│   │   ├── stories/
│   │   │   ├── charts/
│   │   │   ├── kpi/
│   │   │   └── ui/
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── playwright.config.ts
│   │   └── package.json
│   │
│   │
│   ├── api/                               # ========== 백엔드 (NestJS) ==========
│   │   ├── src/
│   │   │   ├── modules/                   # ---- 도메인 모듈 (Modular Monolith) ----
│   │   │   │   │
│   │   │   │   ├── recruitment/           # [모듈1] 채용
│   │   │   │   │   ├── recruitment.module.ts
│   │   │   │   │   ├── recruitment.resolver.ts
│   │   │   │   │   ├── recruitment.service.ts
│   │   │   │   │   ├── recruitment.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-requisition.dto.ts
│   │   │   │   │   │   ├── update-application.dto.ts
│   │   │   │   │   │   └── recruitment-filter.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── job-requisition.entity.ts
│   │   │   │   │   │   ├── candidate.entity.ts
│   │   │   │   │   │   ├── application.entity.ts
│   │   │   │   │   │   └── interview.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   │   ├── application-received.event.ts
│   │   │   │   │   │   └── offer-accepted.event.ts
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── workforce/             # [모듈2] 인력 운영
│   │   │   │   │   ├── workforce.module.ts
│   │   │   │   │   ├── workforce.resolver.ts
│   │   │   │   │   ├── workforce.service.ts
│   │   │   │   │   ├── workforce.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── employee.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── performance/           # [모듈3] 성과 관리
│   │   │   │   │   ├── performance.module.ts
│   │   │   │   │   ├── performance.resolver.ts
│   │   │   │   │   ├── performance.service.ts
│   │   │   │   │   ├── performance.repository.ts
│   │   │   │   │   ├── calibration/       # 캘리브레이션 시뮬레이터
│   │   │   │   │   │   ├── calibration.service.ts
│   │   │   │   │   │   └── calibration.resolver.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── performance-cycle.entity.ts
│   │   │   │   │   │   └── performance-review.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── culture/               # [모듈4] 조직문화/몰입도
│   │   │   │   │   ├── culture.module.ts
│   │   │   │   │   ├── culture.resolver.ts
│   │   │   │   │   ├── culture.service.ts
│   │   │   │   │   ├── culture.repository.ts
│   │   │   │   │   ├── pulse/             # Culture Pulse AI
│   │   │   │   │   │   ├── pulse.service.ts
│   │   │   │   │   │   └── pulse.resolver.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── survey.entity.ts
│   │   │   │   │   │   └── survey-response.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── development/           # [모듈5] 인재개발
│   │   │   │   │   ├── development.module.ts
│   │   │   │   │   ├── development.resolver.ts
│   │   │   │   │   ├── development.service.ts
│   │   │   │   │   ├── development.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── training-program.entity.ts
│   │   │   │   │   │   └── training-enrollment.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── dei/                   # [모듈6] DEI
│   │   │   │   │   ├── dei.module.ts
│   │   │   │   │   ├── dei.resolver.ts
│   │   │   │   │   ├── dei.service.ts
│   │   │   │   │   ├── dei.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── dei-metrics.entity.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── lifecycle/             # [모듈7] 통합 라이프사이클
│   │   │   │   │   ├── lifecycle.module.ts
│   │   │   │   │   ├── lifecycle.resolver.ts
│   │   │   │   │   ├── lifecycle.service.ts
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── notification/          # 알림 모듈
│   │   │   │   │   ├── notification.module.ts
│   │   │   │   │   ├── notification.gateway.ts    # WebSocket
│   │   │   │   │   ├── notification.service.ts
│   │   │   │   │   ├── notification.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── notification.entity.ts
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── auth/                  # 인증/인가 모듈
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.resolver.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   │   ├── rbac.guard.ts
│   │   │   │   │   │   └── rls.guard.ts
│   │   │   │   │   ├── decorators/
│   │   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   │   └── current-user.decorator.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── user-account.entity.ts
│   │   │   │   │   │   ├── role.entity.ts
│   │   │   │   │   │   └── user-role.entity.ts
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   ├── integration/           # 외부 시스템 연동
│   │   │   │   │   ├── integration.module.ts
│   │   │   │   │   ├── adapters/
│   │   │   │   │   │   ├── ats.adapter.ts
│   │   │   │   │   │   ├── hris.adapter.ts
│   │   │   │   │   │   ├── lms.adapter.ts
│   │   │   │   │   │   └── survey.adapter.ts
│   │   │   │   │   ├── sync/
│   │   │   │   │   │   └── data-sync.service.ts
│   │   │   │   │   └── __tests__/
│   │   │   │   │
│   │   │   │   └── kpi/                   # KPI 스냅샷 모듈
│   │   │   │       ├── kpi.module.ts
│   │   │   │       ├── kpi.resolver.ts
│   │   │   │       ├── kpi.service.ts
│   │   │   │       ├── kpi.scheduler.ts
│   │   │   │       ├── entities/
│   │   │   │       │   └── kpi-snapshot.entity.ts
│   │   │   │       └── __tests__/
│   │   │   │
│   │   │   ├── shared/                    # ---- 공유 모듈 ----
│   │   │   │   ├── database/
│   │   │   │   │   ├── database.module.ts
│   │   │   │   │   ├── prisma.service.ts
│   │   │   │   │   └── timescale.service.ts
│   │   │   │   ├── cache/
│   │   │   │   │   ├── cache.module.ts
│   │   │   │   │   └── redis.service.ts
│   │   │   │   ├── messaging/
│   │   │   │   │   ├── messaging.module.ts
│   │   │   │   │   └── kafka.service.ts
│   │   │   │   ├── search/
│   │   │   │   │   ├── search.module.ts
│   │   │   │   │   └── elasticsearch.service.ts
│   │   │   │   ├── audit/
│   │   │   │   │   ├── audit.module.ts
│   │   │   │   │   ├── audit.service.ts
│   │   │   │   │   └── audit-log.entity.ts
│   │   │   │   └── utils/
│   │   │   │       ├── pagination.ts
│   │   │   │       ├── date.ts
│   │   │   │       └── crypto.ts
│   │   │   │
│   │   │   ├── graphql/                   # GraphQL 스키마
│   │   │   │   ├── schema.gql
│   │   │   │   └── scalars/
│   │   │   │       ├── date.scalar.ts
│   │   │   │       └── json.scalar.ts
│   │   │   │
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   │       ├── seed.ts
│   │   │       ├── roles.seed.ts
│   │   │       ├── demo-data.seed.ts
│   │   │       └── kpi-definitions.seed.ts
│   │   │
│   │   ├── test/
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   │
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   └── package.json
│   │
│   │
│   └── ml-service/                        # ========== ML 서비스 (FastAPI) ==========
│       ├── src/
│       │   ├── api/
│       │   │   ├── routes/
│       │   │   │   ├── attrition.py       # 이탈 예측 API
│       │   │   │   ├── recruitment.py     # 채용 예측 API
│       │   │   │   ├── sentiment.py       # 감성 분석 API
│       │   │   │   └── health.py
│       │   │   └── deps.py
│       │   │
│       │   ├── models/
│       │   │   ├── attrition/             # XGBoost
│       │   │   │   ├── model.py
│       │   │   │   ├── features.py
│       │   │   │   └── train.py
│       │   │   ├── recruitment/           # LightGBM
│       │   │   │   ├── model.py
│       │   │   │   ├── features.py
│       │   │   │   └── train.py
│       │   │   └── sentiment/             # KoBERT
│       │   │       ├── model.py
│       │   │       ├── preprocessor.py
│       │   │       └── train.py
│       │   │
│       │   ├── feature_store/
│       │   │   ├── store.py
│       │   │   ├── registry.py
│       │   │   └── transformers.py
│       │   │
│       │   ├── core/
│       │   │   ├── config.py
│       │   │   ├── logging.py
│       │   │   └── exceptions.py
│       │   │
│       │   └── main.py
│       │
│       ├── notebooks/
│       │   ├── eda/
│       │   ├── experiments/
│       │   └── evaluation/
│       │
│       ├── mlflow/
│       │   └── mlflow.yaml
│       ├── tests/
│       │   ├── test_attrition.py
│       │   ├── test_recruitment.py
│       │   └── test_sentiment.py
│       │
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── pyproject.toml
│       └── package.json
│
│
├── packages/                              # ========== 공유 패키지 ==========
│   ├── shared-types/                      # 공유 TypeScript 타입
│   │   ├── src/
│   │   │   ├── kpi.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── employee.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── design-tokens/                     # 디자인 토큰
│   │   ├── src/
│   │   │   ├── colors.ts                  # 컬러 팔레트 (신호등 포함)
│   │   │   ├── typography.ts              # Pretendard + Inter + JetBrains Mono
│   │   │   ├── spacing.ts                 # 4px 기반
│   │   │   ├── breakpoints.ts
│   │   │   ├── shadows.ts
│   │   │   ├── chart-colors.ts            # 차트 전용 컬러
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── eslint-config/                     # 공유 ESLint
│   │   ├── base.js
│   │   ├── react.js
│   │   ├── nest.js
│   │   └── package.json
│   │
│   └── tsconfig/                          # 공유 TypeScript 설정
│       ├── base.json
│       ├── nextjs.json
│       ├── nestjs.json
│       └── package.json
│
│
├── infra/                                 # ========== 인프라 ==========
│   ├── docker/
│   │   ├── docker-compose.yml             # 로컬 개발 환경
│   │   ├── docker-compose.test.yml
│   │   ├── web.Dockerfile
│   │   ├── api.Dockerfile
│   │   └── ml-service.Dockerfile
│   │
│   ├── kubernetes/
│   │   ├── base/
│   │   │   ├── namespace.yaml
│   │   │   ├── web/
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── service.yaml
│   │   │   │   └── hpa.yaml
│   │   │   ├── api/
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── service.yaml
│   │   │   │   └── hpa.yaml
│   │   │   ├── ml-service/
│   │   │   │   ├── deployment.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── postgres/
│   │   │   │   ├── statefulset.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── redis/
│   │   │   │   ├── statefulset.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── kafka/
│   │   │   │   ├── statefulset.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── elasticsearch/
│   │   │   │   ├── statefulset.yaml
│   │   │   │   └── service.yaml
│   │   │   └── ingress.yaml
│   │   ├── overlays/
│   │   │   ├── staging/
│   │   │   │   └── kustomization.yaml
│   │   │   └── production/
│   │   │       └── kustomization.yaml
│   │   └── kustomization.yaml
│   │
│   ├── monitoring/
│   │   ├── prometheus/
│   │   │   ├── prometheus.yml
│   │   │   └── alert-rules.yml
│   │   ├── grafana/
│   │   │   ├── dashboards/
│   │   │   │   ├── api-performance.json
│   │   │   │   ├── ml-service.json
│   │   │   │   └── business-kpi.json
│   │   │   └── datasources.yml
│   │   └── jaeger/
│   │       └── jaeger.yml
│   │
│   └── terraform/
│       ├── modules/
│       │   ├── eks/
│       │   ├── rds/
│       │   └── elasticache/
│       ├── environments/
│       │   ├── staging/
│       │   └── production/
│       └── main.tf
│
│
├── docs/                                  # ========== 문서 ==========
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── data-flow.md
│   │   ├── module-dependencies.md
│   │   └── adr/                           # Architecture Decision Records
│   │       ├── 001-modular-monolith.md
│   │       ├── 002-graphql-primary.md
│   │       └── 003-echart-d3-hybrid.md
│   ├── api/
│   │   ├── graphql-schema.md
│   │   └── rest-endpoints.md
│   ├── design/
│   │   ├── design-system.md
│   │   ├── wireframes/
│   │   │   ├── executive-view.md
│   │   │   ├── manager-view.md
│   │   │   └── hr-specialist-view.md
│   │   └── chart-style-guide.md
│   ├── guides/
│   │   ├── getting-started.md
│   │   ├── contributing.md
│   │   └── deployment.md
│   └── project/
│       ├── folder-structure.md            # (이 파일)
│       ├── wbs.md
│       ├── release-plan.md
│       └── risk-register.md
│
│
├── scripts/                               # ========== 유틸리티 스크립트 ==========
│   ├── setup.sh
│   ├── seed-db.sh
│   ├── generate-types.sh
│   └── health-check.sh
│
│
├── .env.example                           # ========== 루트 설정 파일 ==========
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── turbo.json                             # Turborepo
├── package.json                           # 루트 package.json
├── pnpm-workspace.yaml                    # pnpm 워크스페이스
├── tsconfig.json
└── README.md
```

---

## 구조 요약 매트릭스

| 영역 | 기술 스택 | 핵심 포인트 |
|------|----------|------------|
| **루트** | Turborepo + pnpm | 3개 앱 + 4개 공유 패키지 모노레포 |
| **Frontend** | Next.js 14 App Router | Route Groups, Parallel Routes (@main/@kpi/@insights) |
| **차트** | ECharts + D3.js + Custom | ECharts 11종 + D3.js 4종 + 커스텀 1종 = 16종 |
| **Backend** | NestJS Modular Monolith | 11개 도메인 모듈 (module/resolver/service/repository) |
| **ML** | FastAPI + MLflow | 3개 모델 (이탈/채용/감성) + Feature Store |
| **공유** | packages/ | shared-types, design-tokens, eslint-config, tsconfig |
| **인프라** | Docker + K8s + Terraform | Kustomize overlays, Prometheus+Grafana+Jaeger |
| **문서** | docs/ | 아키텍처, API, 디자인, 가이드, 프로젝트 관리 |

---

## 모듈-폴더 매핑

| 대시보드 모듈 | FE Route | BE Module | ML Model |
|-------------|----------|-----------|----------|
| 채용 분석 | `/recruitment` | `modules/recruitment` | `models/recruitment` |
| 인력 운영 | `/workforce` | `modules/workforce` | - |
| 성과 관리 | `/performance` | `modules/performance` | - |
| 조직문화/몰입도 | `/culture` | `modules/culture` | `models/sentiment` |
| 인재개발 | `/development` | `modules/development` | - |
| DEI | `/dei` | `modules/dei` | - |
| 통합 라이프사이클 | `/lifecycle` | `modules/lifecycle` | `models/attrition` |
