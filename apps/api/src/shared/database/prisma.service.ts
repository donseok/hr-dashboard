import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

type MockRecord = Record<string, unknown>;

const me: MockRecord[] = [
  { id:'1',employeeNumber:'EMP001',firstName:'민준',lastName:'김',email:'minjun.kim@dkhr.com',phone:'010-1234-5678',departmentId:'1',department:'개발팀',position:'시니어 개발자',status:'ACTIVE',hireDate:new Date('2020-03-01'),salary:85000000,managerId:null,createdAt:new Date(),updatedAt:new Date() },
    { id:'2',employeeNumber:'EMP002',firstName:'서연',lastName:'이',email:'seoyeon.lee@dkhr.com',phone:'010-2345-6789',departmentId:'2',department:'인사팀',position:'HR 매니저',status:'ACTIVE',hireDate:new Date('2019-05-15'),salary:72000000,managerId:null,createdAt:new Date(),updatedAt:new Date() },
      { id:'3',employeeNumber:'EMP003',firstName:'도윤',lastName:'박',email:'doyun.park@dkhr.com',phone:'010-3456-7890',departmentId:'3',department:'마케팅팀',position:'마케팅 리더',status:'ACTIVE',hireDate:new Date('2021-01-10'),salary:68000000,managerId:'2',createdAt:new Date(),updatedAt:new Date() },
        { id:'4',employeeNumber:'EMP004',firstName:'지아',lastName:'최',email:'jia.choi@dkhr.com',phone:'010-4567-8901',departmentId:'1',department:'개발팀',position:'프론트엔드 개발자',status:'ACTIVE',hireDate:new Date('2022-07-01'),salary:62000000,managerId:'1',createdAt:new Date(),updatedAt:new Date() },
          { id:'5',employeeNumber:'EMP005',firstName:'현우',lastName:'정',email:'hyunwoo.jung@dkhr.com',phone:'010-5678-9012',departmentId:'4',department:'재무팀',position:'재무 분석가',status:'ACTIVE',hireDate:new Date('2021-09-01'),salary:70000000,managerId:null,createdAt:new Date(),updatedAt:new Date() },
          ];
          const md: MockRecord[] = [
            { id:'1',name:'개발팀',code:'DEV',headCount:45,budget:500000000,createdAt:new Date(),updatedAt:new Date() },
              { id:'2',name:'인사팀',code:'HR',headCount:12,budget:150000000,createdAt:new Date(),updatedAt:new Date() },
                { id:'3',name:'마케팅팀',code:'MKT',headCount:20,budget:200000000,createdAt:new Date(),updatedAt:new Date() },
                  { id:'4',name:'재무팀',code:'FIN',headCount:15,budget:180000000,createdAt:new Date(),updatedAt:new Date() },
                    { id:'5',name:'데이터팀',code:'DAT',headCount:18,budget:220000000,createdAt:new Date(),updatedAt:new Date() },
                    ];
                    const mr: MockRecord[] = [
                      { id:'1',title:'시니어 백엔드 개발자',departmentId:'1',status:'OPEN',applicantCount:24,createdAt:new Date(),updatedAt:new Date() },
                        { id:'2',title:'UX 디자이너',departmentId:'5',status:'OPEN',applicantCount:18,createdAt:new Date(),updatedAt:new Date() },
                          { id:'3',title:'데이터 사이언티스트',departmentId:'5',status:'INTERVIEWING',applicantCount:12,createdAt:new Date(),updatedAt:new Date() },
                          ];
                          const mp: MockRecord[] = [
                            { id:'1',employeeId:'1',period:'2025-H2',rating:4.5,score:92,goals:5,completedGoals:5,createdAt:new Date(),updatedAt:new Date() },
                              { id:'2',employeeId:'2',period:'2025-H2',rating:4.2,score:88,goals:4,completedGoals:4,createdAt:new Date(),updatedAt:new Date() },
                                { id:'3',employeeId:'3',period:'2025-H2',rating:3.8,score:80,goals:6,completedGoals:5,createdAt:new Date(),updatedAt:new Date() },
                                  { id:'4',employeeId:'4',period:'2025-H2',rating:4.0,score:84,goals:4,completedGoals:3,createdAt:new Date(),updatedAt:new Date() },
                                  ];
                                  const mk: MockRecord[] = [
                                    { id:'1',name:'전체 직원 수',value:247,unit:'명',trend:'UP',trendValue:3.2,category:'WORKFORCE',updatedAt:new Date() },
                                      { id:'2',name:'이직률',value:8.5,unit:'%',trend:'DOWN',trendValue:-1.2,category:'WORKFORCE',updatedAt:new Date() },
                                        { id:'3',name:'평균 성과 점수',value:86,unit:'점',trend:'UP',trendValue:2.1,category:'PERFORMANCE',updatedAt:new Date() },
                                          { id:'4',name:'채용 완료율',value:92,unit:'%',trend:'UP',trendValue:5.0,category:'RECRUITMENT',updatedAt:new Date() },
                                            { id:'5',name:'교육 이수율',value:78,unit:'%',trend:'UP',trendValue:4.3,category:'DEVELOPMENT',updatedAt:new Date() },
                                              { id:'6',name:'직원 만족도',value:4.2,unit:'점',trend:'UP',trendValue:0.3,category:'CULTURE',updatedAt:new Date() },
                                              ];

                                              function mm(items: MockRecord[]) {
                                                const match = (item: MockRecord, where?: MockRecord) =>
                                                    !where || Object.entries(where).every(([k, v]) => item[k] === v);
                                                      return {
                                                          findMany: async (a?: { where?: MockRecord; take?: number; skip?: number; orderBy?: unknown; include?: unknown; select?: unknown }) => {
                                                                let r = [...items].filter(i => match(i, a?.where));
                                                                      if (a?.skip) r = r.slice(a.skip);
                                                                            if (a?.take) r = r.slice(0, a.take);
                                                                                  return r;
                                                                                      },
                                                                                          findFirst: async (a?: { where?: MockRecord }) => items.find(i => match(i, a?.where)) ?? null,
                                                                                              findUnique: async (a: { where: MockRecord }) => items.find(i => match(i, a.where)) ?? null,
                                                                                                  count: async (a?: { where?: MockRecord }) => items.filter(i => match(i, a?.where)).length,
                                                                                                      create: async (a: { data: MockRecord }) => {
                                                                                                            const n = { id: String(items.length + 1), ...a.data, createdAt: new Date(), updatedAt: new Date() };
                                                                                                                  items.push(n); return n;
                                                                                                                      },
                                                                                                                          update: async (a: { where: MockRecord; data: MockRecord }) => {
                                                                                                                                const f = items.find(i => match(i, a.where));
                                                                                                                                      if (f) Object.assign(f, a.data, { updatedAt: new Date() });
                                                                                                                                            return f ?? null;
                                                                                                                                                },
                                                                                                                                                    delete: async (a: { where: MockRecord }) => {
                                                                                                                                                          const idx = items.findIndex(i => match(i, a.where));
                                                                                                                                                                return idx >= 0 ? items.splice(idx, 1)[0] : null;
                                                                                                                                                                    },
                                                                                                                                                                        upsert: async (a: { where: MockRecord; create: MockRecord; update: MockRecord }) => {
                                                                                                                                                                              const f = items.find(i => match(i, a.where));
                                                                                                                                                                                    if (f) { Object.assign(f, a.update, { updatedAt: new Date() }); return f; }
                                                                                                                                                                                          const n = { id: String(items.length + 1), ...a.create, createdAt: new Date(), updatedAt: new Date() };
                                                                                                                                                                                                items.push(n); return n;
                                                                                                                                                                                                    },
                                                                                                                                                                                                        aggregate: async () => ({ _count: { _all: items.length }, _avg: {}, _sum: {}, _min: {}, _max: {} }),
                                                                                                                                                                                                            groupBy: async () => [],
                                                                                                                                                                                                              };
                                                                                                                                                                                                              }

                                                                                                                                                                                                              @Injectable()
                                                                                                                                                                                                              export class PrismaService implements OnModuleInit, OnModuleDestroy {
                                                                                                                                                                                                                private readonly logger = new Logger(PrismaService.name);
                                                                                                                                                                                                                  readonly employee = mm(me);
                                                                                                                                                                                                                    readonly department = mm(md);
                                                                                                                                                                                                                      readonly recruitment = mm(mr);
                                                                                                                                                                                                                        readonly performanceReview = mm(mp);
                                                                                                                                                                                                                          readonly kpi = mm(mk);
                                                                                                                                                                                                                            readonly auditLog = mm([]);
                                                                                                                                                                                                                              readonly notification = mm([]);
                                                                                                                                                                                                                                readonly leave = mm([]);
                                                                                                                                                                                                                                  readonly training = mm([]);
                                                                                                                                                                                                                                    readonly goal = mm([]);
                                                                                                                                                                                                                                      readonly survey = mm([]);
                                                                                                                                                                                                                                        readonly integration = mm([]);
                                                                                                                                                                                                                                          readonly applicant = mm([]);
                                                                                                                                                                                                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                                                                                                                                                                                              async $transaction(fn: (tx: any) => Promise<unknown>) { return fn(this); }
                                                                                                                                                                                                                                                async $queryRaw(..._args: unknown[]) { return []; }
                                                                                                                                                                                                                                                  async $executeRaw(..._args: unknown[]) { return 0; }
                                                                                                                                                                                                                                                    async $connect() { this.logger.log('[Mock] DB connected'); }
                                                                                                                                                                                                                                                      async $disconnect() { this.logger.log('[Mock] DB disconnected'); }
                                                                                                                                                                                                                                                        async onModuleInit() { await this.$connect(); }
                                                                                                                                                                                                                                                          async onModuleDestroy() { await this.$disconnect(); }
                                                                                                                                                                                                                                                          }