import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedDemoData(prisma: PrismaClient) {
  console.log('Seeding demo data...');

  // ─── Organization ──────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { code: 'ACME' },
    create: {
      name: 'Acme Corporation',
      code: 'ACME',
      industry: 'Technology',
      size: '500-1000',
    },
    update: {},
  });
  console.log('  Organization: Acme Corporation');

  // ─── Departments ───────────────────────────────────────
  const departments = [
    { name: 'Engineering', code: 'ENG', description: 'Software Engineering' },
    { name: 'Product', code: 'PROD', description: 'Product Management' },
    { name: 'Design', code: 'DES', description: 'UX/UI Design' },
    { name: 'Marketing', code: 'MKT', description: 'Marketing & Communications' },
    { name: 'Sales', code: 'SAL', description: 'Sales & Business Development' },
    { name: 'Human Resources', code: 'HR', description: 'People Operations' },
    { name: 'Finance', code: 'FIN', description: 'Finance & Accounting' },
    { name: 'Operations', code: 'OPS', description: 'Operations & Infrastructure' },
  ];

  const deptMap = new Map<string, string>();
  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      create: { ...dept, organizationId: org.id },
      update: {},
    });
    deptMap.set(dept.code, d.id);
  }
  console.log(`  Departments: ${departments.length}`);

  // ─── Employees (55 total) ──────────────────────────────
  const employeeData = [
    // Engineering (15)
    { firstName: 'Sarah', lastName: 'Kim', email: 'sarah.kim@acme.com', position: 'VP of Engineering', grade: 'L8', deptCode: 'ENG', employeeNumber: 'EMP001', hireYear: 2019, salary: 180000, gender: 'female' },
    { firstName: 'James', lastName: 'Park', email: 'james.park@acme.com', position: 'Senior Engineer', grade: 'L6', deptCode: 'ENG', employeeNumber: 'EMP002', hireYear: 2020, salary: 145000, gender: 'male' },
    { firstName: 'Sophia', lastName: 'Han', email: 'sophia.han@acme.com', position: 'Junior Engineer', grade: 'L3', deptCode: 'ENG', employeeNumber: 'EMP010', hireYear: 2024, salary: 75000, gender: 'female' },
    { firstName: 'Kevin', lastName: 'Lim', email: 'kevin.lim@acme.com', position: 'Staff Engineer', grade: 'L7', deptCode: 'ENG', employeeNumber: 'EMP011', hireYear: 2018, salary: 165000, gender: 'male' },
    { firstName: 'Grace', lastName: 'Cho', email: 'grace.cho@acme.com', position: 'Senior Engineer', grade: 'L6', deptCode: 'ENG', employeeNumber: 'EMP012', hireYear: 2021, salary: 140000, gender: 'female' },
    { firstName: 'Ryan', lastName: 'Jung', email: 'ryan.jung@acme.com', position: 'Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP013', hireYear: 2022, salary: 115000, gender: 'male' },
    { firstName: 'Mina', lastName: 'Seo', email: 'mina.seo@acme.com', position: 'Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP014', hireYear: 2022, salary: 118000, gender: 'female' },
    { firstName: 'Eric', lastName: 'Hong', email: 'eric.hong@acme.com', position: 'Junior Engineer', grade: 'L3', deptCode: 'ENG', employeeNumber: 'EMP015', hireYear: 2024, salary: 78000, gender: 'male' },
    { firstName: 'Yuna', lastName: 'Moon', email: 'yuna.moon@acme.com', position: 'QA Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP016', hireYear: 2021, salary: 105000, gender: 'female' },
    { firstName: 'Brian', lastName: 'Kang', email: 'brian.kang@acme.com', position: 'DevOps Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP017', hireYear: 2023, salary: 125000, gender: 'male' },
    { firstName: 'Hannah', lastName: 'Yoo', email: 'hannah.yoo@acme.com', position: 'Frontend Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP018', hireYear: 2023, salary: 120000, gender: 'female' },
    { firstName: 'Tom', lastName: 'Baek', email: 'tom.baek@acme.com', position: 'Backend Engineer', grade: 'L4', deptCode: 'ENG', employeeNumber: 'EMP019', hireYear: 2024, salary: 95000, gender: 'male' },
    { firstName: 'Lisa', lastName: 'Shin', email: 'lisa.shin@acme.com', position: 'Data Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP020', hireYear: 2022, salary: 130000, gender: 'female' },
    { firstName: 'Chris', lastName: 'Ahn', email: 'chris.ahn@acme.com', position: 'ML Engineer', grade: 'L6', deptCode: 'ENG', employeeNumber: 'EMP021', hireYear: 2021, salary: 150000, gender: 'male' },
    { firstName: 'Jiwon', lastName: 'Noh', email: 'jiwon.noh@acme.com', position: 'Intern', grade: 'L1', deptCode: 'ENG', employeeNumber: 'EMP022', hireYear: 2025, salary: 50000, gender: 'female', employmentType: 'INTERN' as const },

    // Product (6)
    { firstName: 'Emily', lastName: 'Chen', email: 'emily.chen@acme.com', position: 'Product Director', grade: 'L7', deptCode: 'PROD', employeeNumber: 'EMP003', hireYear: 2019, salary: 160000, gender: 'female' },
    { firstName: 'Jake', lastName: 'Kwon', email: 'jake.kwon@acme.com', position: 'Product Manager', grade: 'L6', deptCode: 'PROD', employeeNumber: 'EMP023', hireYear: 2021, salary: 135000, gender: 'male' },
    { firstName: 'Soyeon', lastName: 'Bae', email: 'soyeon.bae@acme.com', position: 'Product Manager', grade: 'L5', deptCode: 'PROD', employeeNumber: 'EMP024', hireYear: 2022, salary: 120000, gender: 'female' },
    { firstName: 'Mark', lastName: 'Song', email: 'mark.song@acme.com', position: 'Product Analyst', grade: 'L4', deptCode: 'PROD', employeeNumber: 'EMP025', hireYear: 2023, salary: 95000, gender: 'male' },
    { firstName: 'Jenny', lastName: 'Hwang', email: 'jenny.hwang@acme.com', position: 'UX Researcher', grade: 'L5', deptCode: 'PROD', employeeNumber: 'EMP026', hireYear: 2022, salary: 110000, gender: 'female' },
    { firstName: 'Sam', lastName: 'Yim', email: 'sam.yim@acme.com', position: 'Associate PM', grade: 'L3', deptCode: 'PROD', employeeNumber: 'EMP027', hireYear: 2024, salary: 80000, gender: 'male' },

    // Design (5)
    { firstName: 'Michael', lastName: 'Lee', email: 'michael.lee@acme.com', position: 'Design Lead', grade: 'L6', deptCode: 'DES', employeeNumber: 'EMP004', hireYear: 2020, salary: 135000, gender: 'male' },
    { firstName: 'Jieun', lastName: 'Yang', email: 'jieun.yang@acme.com', position: 'UX Designer', grade: 'L5', deptCode: 'DES', employeeNumber: 'EMP028', hireYear: 2021, salary: 110000, gender: 'female' },
    { firstName: 'Lucas', lastName: 'Go', email: 'lucas.go@acme.com', position: 'UI Designer', grade: 'L4', deptCode: 'DES', employeeNumber: 'EMP029', hireYear: 2023, salary: 90000, gender: 'male' },
    { firstName: 'Somin', lastName: 'Jang', email: 'somin.jang@acme.com', position: 'Visual Designer', grade: 'L4', deptCode: 'DES', employeeNumber: 'EMP030', hireYear: 2023, salary: 88000, gender: 'female' },
    { firstName: 'Peter', lastName: 'Na', email: 'peter.na@acme.com', position: 'Junior Designer', grade: 'L3', deptCode: 'DES', employeeNumber: 'EMP031', hireYear: 2024, salary: 72000, gender: 'male' },

    // Marketing (6)
    { firstName: 'Jessica', lastName: 'Wang', email: 'jessica.wang@acme.com', position: 'Marketing Director', grade: 'L7', deptCode: 'MKT', employeeNumber: 'EMP005', hireYear: 2019, salary: 155000, gender: 'female' },
    { firstName: 'Daniel', lastName: 'Yun', email: 'daniel.yun@acme.com', position: 'Content Manager', grade: 'L5', deptCode: 'MKT', employeeNumber: 'EMP032', hireYear: 2021, salary: 100000, gender: 'male' },
    { firstName: 'Hana', lastName: 'Im', email: 'hana.im@acme.com', position: 'Growth Marketer', grade: 'L5', deptCode: 'MKT', employeeNumber: 'EMP033', hireYear: 2022, salary: 105000, gender: 'female' },
    { firstName: 'Tony', lastName: 'Roh', email: 'tony.roh@acme.com', position: 'Marketing Specialist', grade: 'L4', deptCode: 'MKT', employeeNumber: 'EMP034', hireYear: 2023, salary: 85000, gender: 'male' },
    { firstName: 'Eunji', lastName: 'Woo', email: 'eunji.woo@acme.com', position: 'Social Media Manager', grade: 'L4', deptCode: 'MKT', employeeNumber: 'EMP035', hireYear: 2023, salary: 82000, gender: 'female' },
    { firstName: 'Andy', lastName: 'Ko', email: 'andy.ko@acme.com', position: 'Marketing Coordinator', grade: 'L3', deptCode: 'MKT', employeeNumber: 'EMP036', hireYear: 2025, salary: 65000, gender: 'male' },

    // Sales (6)
    { firstName: 'David', lastName: 'Choi', email: 'david.choi@acme.com', position: 'Sales Director', grade: 'L7', deptCode: 'SAL', employeeNumber: 'EMP006', hireYear: 2019, salary: 160000, gender: 'male' },
    { firstName: 'Yejin', lastName: 'Son', email: 'yejin.son@acme.com', position: 'Account Executive', grade: 'L5', deptCode: 'SAL', employeeNumber: 'EMP037', hireYear: 2021, salary: 100000, gender: 'female' },
    { firstName: 'Noah', lastName: 'Min', email: 'noah.min@acme.com', position: 'Sales Manager', grade: 'L6', deptCode: 'SAL', employeeNumber: 'EMP038', hireYear: 2020, salary: 130000, gender: 'male' },
    { firstName: 'Minji', lastName: 'Gil', email: 'minji.gil@acme.com', position: 'Account Executive', grade: 'L4', deptCode: 'SAL', employeeNumber: 'EMP039', hireYear: 2023, salary: 85000, gender: 'female' },
    { firstName: 'Ian', lastName: 'Tak', email: 'ian.tak@acme.com', position: 'SDR', grade: 'L3', deptCode: 'SAL', employeeNumber: 'EMP040', hireYear: 2024, salary: 65000, gender: 'male' },
    { firstName: 'Suzy', lastName: 'Ha', email: 'suzy.ha@acme.com', position: 'Customer Success', grade: 'L5', deptCode: 'SAL', employeeNumber: 'EMP041', hireYear: 2022, salary: 95000, gender: 'female' },

    // HR (5)
    { firstName: 'Jennifer', lastName: 'Yoon', email: 'jennifer.yoon@acme.com', position: 'HR Director', grade: 'L7', deptCode: 'HR', employeeNumber: 'EMP007', hireYear: 2018, salary: 150000, gender: 'female' },
    { firstName: 'Paul', lastName: 'Cha', email: 'paul.cha@acme.com', position: 'HR Manager', grade: 'L6', deptCode: 'HR', employeeNumber: 'EMP042', hireYear: 2020, salary: 120000, gender: 'male' },
    { firstName: 'Jihye', lastName: 'Nam', email: 'jihye.nam@acme.com', position: 'Recruiter', grade: 'L4', deptCode: 'HR', employeeNumber: 'EMP043', hireYear: 2022, salary: 85000, gender: 'female' },
    { firstName: 'Ben', lastName: 'Eom', email: 'ben.eom@acme.com', position: 'HR Coordinator', grade: 'L3', deptCode: 'HR', employeeNumber: 'EMP044', hireYear: 2024, salary: 62000, gender: 'male' },
    { firstName: 'Sera', lastName: 'Hyun', email: 'sera.hyun@acme.com', position: 'L&D Specialist', grade: 'L5', deptCode: 'HR', employeeNumber: 'EMP045', hireYear: 2021, salary: 95000, gender: 'female' },

    // Finance (5)
    { firstName: 'Daniel', lastName: 'Oh', email: 'daniel.oh@acme.com', position: 'Finance Director', grade: 'L7', deptCode: 'FIN', employeeNumber: 'EMP008', hireYear: 2019, salary: 155000, gender: 'male' },
    { firstName: 'Luna', lastName: 'Byun', email: 'luna.byun@acme.com', position: 'Senior Accountant', grade: 'L5', deptCode: 'FIN', employeeNumber: 'EMP046', hireYear: 2021, salary: 100000, gender: 'female' },
    { firstName: 'Steve', lastName: 'Ban', email: 'steve.ban@acme.com', position: 'Financial Analyst', grade: 'L4', deptCode: 'FIN', employeeNumber: 'EMP047', hireYear: 2023, salary: 88000, gender: 'male' },
    { firstName: 'Hyerin', lastName: 'Jo', email: 'hyerin.jo@acme.com', position: 'Payroll Specialist', grade: 'L4', deptCode: 'FIN', employeeNumber: 'EMP048', hireYear: 2022, salary: 80000, gender: 'female' },
    { firstName: 'Max', lastName: 'Yeo', email: 'max.yeo@acme.com', position: 'Tax Accountant', grade: 'L5', deptCode: 'FIN', employeeNumber: 'EMP049', hireYear: 2021, salary: 105000, gender: 'male' },

    // Operations (5)
    { firstName: 'Alex', lastName: 'Ryu', email: 'alex.ryu@acme.com', position: 'Ops Director', grade: 'L7', deptCode: 'OPS', employeeNumber: 'EMP009', hireYear: 2019, salary: 150000, gender: 'male' },
    { firstName: 'Dahee', lastName: 'Pyo', email: 'dahee.pyo@acme.com', position: 'SRE', grade: 'L5', deptCode: 'OPS', employeeNumber: 'EMP050', hireYear: 2022, salary: 120000, gender: 'female' },
    { firstName: 'Fred', lastName: 'Gong', email: 'fred.gong@acme.com', position: 'IT Support', grade: 'L3', deptCode: 'OPS', employeeNumber: 'EMP051', hireYear: 2023, salary: 65000, gender: 'male' },
    { firstName: 'Sujin', lastName: 'Heo', email: 'sujin.heo@acme.com', position: 'Security Engineer', grade: 'L5', deptCode: 'OPS', employeeNumber: 'EMP052', hireYear: 2021, salary: 130000, gender: 'female' },
    { firstName: 'Will', lastName: 'Dong', email: 'will.dong@acme.com', position: 'Network Engineer', grade: 'L4', deptCode: 'OPS', employeeNumber: 'EMP053', hireYear: 2023, salary: 90000, gender: 'male' },

    // Terminated employees (for turnover data)
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@acme.com', position: 'Engineer', grade: 'L5', deptCode: 'ENG', employeeNumber: 'EMP054', hireYear: 2022, salary: 110000, gender: 'male', status: 'TERMINATED' as const, terminationMonth: 8 },
    { firstName: 'Amy', lastName: 'Lam', email: 'amy.lam@acme.com', position: 'Designer', grade: 'L4', deptCode: 'DES', employeeNumber: 'EMP055', hireYear: 2023, salary: 85000, gender: 'female', status: 'TERMINATED' as const, terminationMonth: 5 },
  ];

  const empMap = new Map<string, string>();
  const allEmpIds: string[] = [];
  for (const emp of employeeData) {
    const hireMonth = Math.floor(Math.random() * 12);
    const hireDay = Math.floor(Math.random() * 28) + 1;
    const e = await prisma.employee.upsert({
      where: { email: emp.email },
      create: {
        employeeNumber: emp.employeeNumber,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        position: emp.position,
        grade: emp.grade,
        departmentId: deptMap.get(emp.deptCode)!,
        organizationId: org.id,
        hireDate: new Date(emp.hireYear, hireMonth, hireDay),
        status: (emp as any).status || 'ACTIVE',
        employmentType: (emp as any).employmentType || 'FULL_TIME',
        location: 'Seoul',
        salary: emp.salary,
        metadata: { gender: emp.gender },
        terminationDate: (emp as any).terminationMonth
          ? new Date(2025, (emp as any).terminationMonth, 15)
          : null,
      },
      update: {},
    });
    empMap.set(emp.email, e.id);
    allEmpIds.push(e.id);
  }
  console.log(`  Employees: ${employeeData.length}`);

  // Set manager relationships
  const engManagerId = empMap.get('sarah.kim@acme.com')!;
  const prodManagerId = empMap.get('emily.chen@acme.com')!;
  const desManagerId = empMap.get('michael.lee@acme.com')!;
  const mktManagerId = empMap.get('jessica.wang@acme.com')!;
  const salManagerId = empMap.get('david.choi@acme.com')!;
  const hrManagerId = empMap.get('jennifer.yoon@acme.com')!;
  const finManagerId = empMap.get('daniel.oh@acme.com')!;
  const opsManagerId = empMap.get('alex.ryu@acme.com')!;

  const managerByDept: Record<string, string> = {
    ENG: engManagerId, PROD: prodManagerId, DES: desManagerId,
    MKT: mktManagerId, SAL: salManagerId, HR: hrManagerId,
    FIN: finManagerId, OPS: opsManagerId,
  };

  for (const emp of employeeData) {
    const empId = empMap.get(emp.email)!;
    const managerId = managerByDept[emp.deptCode];
    if (managerId && empId !== managerId) {
      await prisma.employee.update({
        where: { id: empId },
        data: { managerId },
      });
    }
  }

  // ─── User Accounts ────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 12);
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const hrRole = await prisma.role.findUnique({ where: { name: 'HR_SPECIALIST' } });
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const execRole = await prisma.role.findUnique({ where: { name: 'EXECUTIVE' } });

  if (adminRole && hrRole && managerRole) {
    const adminUser = await prisma.userAccount.upsert({
      where: { email: 'admin@acme.com' },
      create: { email: 'admin@acme.com', passwordHash, isActive: true },
      update: {},
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      create: { userId: adminUser.id, roleId: adminRole.id },
      update: {},
    });

    const hrUser = await prisma.userAccount.upsert({
      where: { email: 'jennifer.yoon@acme.com' },
      create: { email: 'jennifer.yoon@acme.com', passwordHash, employeeId: empMap.get('jennifer.yoon@acme.com'), isActive: true },
      update: {},
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: hrUser.id, roleId: hrRole.id } },
      create: { userId: hrUser.id, roleId: hrRole.id },
      update: {},
    });

    const mgrUser = await prisma.userAccount.upsert({
      where: { email: 'sarah.kim@acme.com' },
      create: { email: 'sarah.kim@acme.com', passwordHash, employeeId: empMap.get('sarah.kim@acme.com'), isActive: true },
      update: {},
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: mgrUser.id, roleId: managerRole.id } },
      create: { userId: mgrUser.id, roleId: managerRole.id },
      update: {},
    });

    if (execRole) {
      const execUser = await prisma.userAccount.upsert({
        where: { email: 'emily.chen@acme.com' },
        create: { email: 'emily.chen@acme.com', passwordHash, employeeId: empMap.get('emily.chen@acme.com'), isActive: true },
        update: {},
      });
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: execUser.id, roleId: execRole.id } },
        create: { userId: execUser.id, roleId: execRole.id },
        update: {},
      });
    }

    console.log('  User accounts: 4 (admin, hr, manager, executive)');
  }

  // ─── Job Requisitions & Candidates & Applications ─────
  const requisitions = [
    { title: 'Senior Frontend Engineer', deptCode: 'ENG', status: 'OPEN' as const, headcount: 2, openMonthsAgo: 2 },
    { title: 'Backend Engineer', deptCode: 'ENG', status: 'OPEN' as const, headcount: 3, openMonthsAgo: 1 },
    { title: 'Product Designer', deptCode: 'DES', status: 'OPEN' as const, headcount: 1, openMonthsAgo: 3 },
    { title: 'Data Analyst', deptCode: 'PROD', status: 'DRAFT' as const, headcount: 1, openMonthsAgo: 0 },
    { title: 'Marketing Specialist', deptCode: 'MKT', status: 'CLOSED' as const, headcount: 1, openMonthsAgo: 6 },
    { title: 'Sales Representative', deptCode: 'SAL', status: 'OPEN' as const, headcount: 2, openMonthsAgo: 1 },
    { title: 'HR Coordinator', deptCode: 'HR', status: 'CLOSED' as const, headcount: 1, openMonthsAgo: 4 },
    { title: 'DevOps Engineer', deptCode: 'OPS', status: 'OPEN' as const, headcount: 1, openMonthsAgo: 2 },
  ];

  const now = new Date();
  const reqIds: string[] = [];
  for (const req of requisitions) {
    const openDate = req.openMonthsAgo > 0
      ? new Date(now.getFullYear(), now.getMonth() - req.openMonthsAgo, 1)
      : null;
    const r = await prisma.jobRequisition.create({
      data: {
        title: req.title,
        departmentId: deptMap.get(req.deptCode)!,
        status: req.status,
        headcount: req.headcount,
        openDate,
        closedDate: req.status === 'CLOSED' ? new Date(now.getFullYear(), now.getMonth() - 1, 15) : null,
        priority: req.headcount > 1 ? 'HIGH' : 'MEDIUM',
        location: 'Seoul',
      },
    });
    reqIds.push(r.id);
  }
  console.log(`  Job requisitions: ${requisitions.length}`);

  // Candidates & Applications (30 candidates)
  const sources = ['LinkedIn', 'Indeed', 'Referral', 'Company Website', 'Job Fair', 'Agency'];
  const stages: Array<'APPLIED' | 'SCREENING' | 'PHONE_INTERVIEW' | 'TECHNICAL_INTERVIEW' | 'ONSITE_INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'> = [
    'APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER', 'HIRED', 'REJECTED',
  ];
  const candidateFirstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Avery', 'Skyler', 'Drew', 'Jamie', 'Peyton', 'Reese', 'Blake', 'Charlie', 'Sam', 'Kit', 'Eden', 'Sage', 'Rowan', 'Harley', 'Emerson', 'Phoenix', 'Kai', 'Ash', 'River', 'Blair', 'Finley', 'Dakota', 'Lennon'];
  const candidateLastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill'];

  for (let i = 0; i < 30; i++) {
    const firstName = candidateFirstNames[i];
    const lastName = candidateLastNames[i];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;

    const candidate = await prisma.candidate.upsert({
      where: { email },
      create: {
        firstName,
        lastName,
        email,
        source: sources[i % sources.length],
      },
      update: {},
    });

    const reqIndex = i % reqIds.length;
    const stageIndex = Math.min(Math.floor(Math.random() * 8), 7);
    const stage = stages[stageIndex];
    const appliedDaysAgo = Math.floor(Math.random() * 90) + 10;

    await prisma.application.upsert({
      where: { candidateId_requisitionId: { candidateId: candidate.id, requisitionId: reqIds[reqIndex] } },
      create: {
        candidateId: candidate.id,
        requisitionId: reqIds[reqIndex],
        stage,
        status: stage === 'REJECTED' ? 'REJECTED' : stage === 'HIRED' ? 'HIRED' : 'ACTIVE',
        score: Math.floor(Math.random() * 40 + 60),
        appliedAt: new Date(now.getTime() - appliedDaysAgo * 24 * 60 * 60 * 1000),
      },
      update: {},
    });
  }
  console.log('  Candidates & applications: 30');

  // ─── Performance Cycles & Reviews ─────────────────────
  const cycle2024 = await prisma.performanceCycle.create({
    data: {
      name: '2024 Annual Review',
      description: 'Full-year performance review for 2024',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'COMPLETED',
    },
  });

  const cycle2025 = await prisma.performanceCycle.create({
    data: {
      name: '2025 H1 Review',
      description: 'First-half 2025 performance cycle',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 5, 30),
      status: 'ACTIVE',
    },
  });

  const ratings: Array<'EXCEPTIONAL' | 'EXCEEDS_EXPECTATIONS' | 'MEETS_EXPECTATIONS' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY'> = [
    'EXCEPTIONAL', 'EXCEEDS_EXPECTATIONS', 'MEETS_EXPECTATIONS', 'NEEDS_IMPROVEMENT', 'UNSATISFACTORY',
  ];
  // Bell curve distribution weights
  const ratingWeights = [10, 20, 45, 20, 5];
  function pickRating(): typeof ratings[number] {
    const r = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < ratingWeights.length; i++) {
      cumulative += ratingWeights[i];
      if (r <= cumulative) return ratings[i];
    }
    return 'MEETS_EXPECTATIONS';
  }

  const activeEmpIds = allEmpIds.filter((_, i) => !(employeeData[i] as any).status || (employeeData[i] as any).status === 'ACTIVE');
  let reviewCount = 0;

  // 2024 reviews (completed, all active employees)
  for (const empId of activeEmpIds) {
    const reviewerIdx = Math.floor(Math.random() * activeEmpIds.length);
    const reviewerId = activeEmpIds[reviewerIdx] === empId
      ? activeEmpIds[(reviewerIdx + 1) % activeEmpIds.length]
      : activeEmpIds[reviewerIdx];

    try {
      await prisma.performanceReview.create({
        data: {
          cycleId: cycle2024.id,
          employeeId: empId,
          reviewerId,
          rating: pickRating(),
          comments: 'Annual review completed.',
          submittedAt: new Date(2024, 11, Math.floor(Math.random() * 28) + 1),
        },
      });
      reviewCount++;
    } catch { /* skip duplicates */ }
  }

  // 2025 reviews (in progress, ~60% completed)
  for (let i = 0; i < activeEmpIds.length; i++) {
    const empId = activeEmpIds[i];
    const reviewerIdx = (i + 3) % activeEmpIds.length;
    const reviewerId = activeEmpIds[reviewerIdx] === empId
      ? activeEmpIds[(reviewerIdx + 1) % activeEmpIds.length]
      : activeEmpIds[reviewerIdx];
    const isSubmitted = i < activeEmpIds.length * 0.6;

    try {
      await prisma.performanceReview.create({
        data: {
          cycleId: cycle2025.id,
          employeeId: empId,
          reviewerId,
          rating: isSubmitted ? pickRating() : null,
          comments: isSubmitted ? 'Mid-year review.' : null,
          submittedAt: isSubmitted ? new Date(2025, 5, Math.floor(Math.random() * 28) + 1) : null,
        },
      });
      reviewCount++;
    } catch { /* skip duplicates */ }
  }
  console.log(`  Performance reviews: ${reviewCount}`);

  // ─── Surveys & Responses ──────────────────────────────
  const survey1 = await prisma.survey.create({
    data: {
      title: 'Q4 2024 Engagement Survey',
      description: 'Quarterly pulse survey measuring employee engagement and satisfaction',
      type: 'PULSE',
      status: 'CLOSED',
      isAnonymous: true,
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 9, 31),
      questions: [
        { id: 'q1', text: 'How satisfied are you with your role?', type: 'rating' },
        { id: 'q2', text: 'How is teamwork in your department?', type: 'rating' },
        { id: 'q3', text: 'Do you feel recognized for your work?', type: 'rating' },
        { id: 'q4', text: 'Comments', type: 'text' },
      ],
    },
  });

  const survey2 = await prisma.survey.create({
    data: {
      title: 'Q1 2025 Engagement Survey',
      description: 'Quarterly pulse survey for Q1 2025',
      type: 'PULSE',
      status: 'CLOSED',
      isAnonymous: true,
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 1, 15),
      questions: [
        { id: 'q1', text: 'How satisfied are you overall?', type: 'rating' },
        { id: 'q2', text: 'Rate your work-life balance', type: 'rating' },
        { id: 'q3', text: 'How is communication in your team?', type: 'rating' },
        { id: 'q4', text: 'Suggestions for improvement', type: 'text' },
      ],
    },
  });

  const survey3 = await prisma.survey.create({
    data: {
      title: '2025 Annual Engagement Survey',
      description: 'Comprehensive annual engagement assessment',
      type: 'ENGAGEMENT',
      status: 'ACTIVE',
      isAnonymous: true,
      startDate: new Date(2025, 2, 1),
      endDate: new Date(2025, 3, 30),
      questions: [
        { id: 'q1', text: 'Overall job satisfaction', type: 'rating' },
        { id: 'q2', text: 'Growth opportunities', type: 'rating' },
        { id: 'q3', text: 'Leadership effectiveness', type: 'rating' },
        { id: 'q4', text: 'Culture and values', type: 'rating' },
        { id: 'q5', text: 'Additional feedback', type: 'text' },
      ],
    },
  });

  const commentOptions = [
    { text: 'Great teamwork and collaboration', keywords: ['teamwork', 'culture'] },
    { text: 'Need more growth opportunities', keywords: ['growth'] },
    { text: 'Leadership is supportive and transparent', keywords: ['leadership', 'communication'] },
    { text: 'Work-life balance could be improved', keywords: ['workload', 'flexibility'] },
    { text: 'Good recognition programs', keywords: ['recognition'] },
    { text: 'Management listens to feedback', keywords: ['management', 'communication'] },
    { text: 'Benefits package is excellent', keywords: ['benefits'] },
    { text: 'More flexibility in work arrangements needed', keywords: ['flexibility'] },
  ];

  let responseCount = 0;
  // Survey 1 responses (Q4 2024) — 40 responses
  for (let i = 0; i < 40; i++) {
    const empId = activeEmpIds[i % activeEmpIds.length];
    const score = Math.random() < 0.55 ? (Math.random() < 0.5 ? 5 : 4) : Math.random() < 0.6 ? 3 : Math.random() < 0.7 ? 2 : 1;
    const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)];
    await prisma.surveyResponse.create({
      data: {
        surveyId: survey1.id,
        employeeId: empId,
        score,
        responses: { q1: score, q2: score - 0.5 + Math.random(), q3: score + Math.random() * 0.5, q4: comment.text },
        submittedAt: new Date(2024, 9, Math.floor(Math.random() * 28) + 1),
      },
    });
    responseCount++;
  }

  // Survey 2 responses (Q1 2025) — 45 responses
  for (let i = 0; i < 45; i++) {
    const empId = activeEmpIds[i % activeEmpIds.length];
    const score = Math.random() < 0.6 ? (Math.random() < 0.5 ? 5 : 4) : Math.random() < 0.6 ? 3 : Math.random() < 0.7 ? 2 : 1;
    const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)];
    await prisma.surveyResponse.create({
      data: {
        surveyId: survey2.id,
        employeeId: empId,
        score,
        responses: { q1: score, q2: score + Math.random() * 0.3, q3: score - Math.random() * 0.3, q4: comment.text },
        submittedAt: new Date(2025, 0, 15 + Math.floor(Math.random() * 30)),
      },
    });
    responseCount++;
  }

  // Survey 3 responses (Active, partial) — 25 responses so far
  for (let i = 0; i < 25; i++) {
    const empId = activeEmpIds[i % activeEmpIds.length];
    const score = Math.random() < 0.6 ? (Math.random() < 0.4 ? 5 : 4) : Math.random() < 0.5 ? 3 : 2;
    const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)];
    await prisma.surveyResponse.create({
      data: {
        surveyId: survey3.id,
        employeeId: empId,
        score,
        responses: { q1: score, q2: score, q3: score, q4: score, q5: comment.text },
        submittedAt: new Date(2025, 2, 1 + Math.floor(Math.random() * 28)),
      },
    });
    responseCount++;
  }
  console.log(`  Survey responses: ${responseCount}`);

  // ─── Training Programs & Enrollments ──────────────────
  const programs = [
    { title: 'Leadership Fundamentals', category: 'Leadership', provider: 'Internal', duration: 40, format: 'Workshop' },
    { title: 'Cloud Architecture', category: 'Technical', provider: 'AWS', duration: 24, format: 'Online' },
    { title: 'Effective Communication', category: 'Soft Skills', provider: 'External', duration: 16, format: 'Classroom' },
    { title: 'Data Analytics Bootcamp', category: 'Technical', provider: 'Internal', duration: 60, format: 'Bootcamp' },
    { title: 'DEI Awareness', category: 'Compliance', provider: 'Internal', duration: 8, format: 'Online' },
    { title: 'Project Management Professional', category: 'Management', provider: 'PMI', duration: 35, format: 'Online' },
    { title: 'Agile & Scrum Mastery', category: 'Management', provider: 'Internal', duration: 16, format: 'Workshop' },
    { title: 'Machine Learning Basics', category: 'Technical', provider: 'Coursera', duration: 40, format: 'Online' },
    { title: 'Negotiation Skills', category: 'Soft Skills', provider: 'External', duration: 12, format: 'Classroom' },
    { title: 'Financial Literacy for Managers', category: 'Management', provider: 'Internal', duration: 8, format: 'Workshop' },
    { title: 'Cybersecurity Fundamentals', category: 'Technical', provider: 'SANS', duration: 20, format: 'Online' },
    { title: 'Design Thinking Workshop', category: 'Innovation', provider: 'IDEO', duration: 16, format: 'Workshop' },
  ];

  const programIds: string[] = [];
  for (const program of programs) {
    const p = await prisma.trainingProgram.create({ data: program });
    programIds.push(p.id);
  }
  console.log(`  Training programs: ${programs.length}`);

  // Enrollments (60+ spread across employees and programs)
  let enrollCount = 0;
  const enrollStatuses: Array<'COMPLETED' | 'IN_PROGRESS' | 'ENROLLED' | 'DROPPED'> = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'ENROLLED', 'DROPPED'];
  for (let i = 0; i < 65; i++) {
    const empId = activeEmpIds[i % activeEmpIds.length];
    const progId = programIds[i % programIds.length];
    const status = enrollStatuses[Math.floor(Math.random() * enrollStatuses.length)];
    const enrollMonthsAgo = Math.floor(Math.random() * 12) + 1;

    try {
      await prisma.trainingEnrollment.create({
        data: {
          programId: progId,
          employeeId: empId,
          status,
          enrolledAt: new Date(now.getFullYear(), now.getMonth() - enrollMonthsAgo, Math.floor(Math.random() * 28) + 1),
          completedAt: status === 'COMPLETED' ? new Date(now.getFullYear(), now.getMonth() - enrollMonthsAgo + 2, Math.floor(Math.random() * 28) + 1) : null,
          score: status === 'COMPLETED' ? Math.floor(Math.random() * 30 + 70) : null,
        },
      });
      enrollCount++;
    } catch { /* skip duplicates */ }
  }
  console.log(`  Training enrollments: ${enrollCount}`);

  // ─── DEI Metrics ──────────────────────────────────────
  const deiPeriods = 12;
  let deiCount = 0;
  for (let i = deiPeriods - 1; i >= 0; i--) {
    const period = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodStr = `${period.getFullYear()}-${String(period.getMonth() + 1).padStart(2, '0')}`;

    // Gender distribution
    await prisma.deiMetric.upsert({
      where: { period_dimension_category: { period: periodStr, dimension: 'gender', category: 'female' } },
      create: { period: periodStr, dimension: 'gender', category: 'female', value: 42 + Math.random() * 4, benchmark: 50 },
      update: {},
    });
    await prisma.deiMetric.upsert({
      where: { period_dimension_category: { period: periodStr, dimension: 'gender', category: 'male' } },
      create: { period: periodStr, dimension: 'gender', category: 'male', value: 55 + Math.random() * 3, benchmark: 50 },
      update: {},
    });
    await prisma.deiMetric.upsert({
      where: { period_dimension_category: { period: periodStr, dimension: 'gender', category: 'non_binary' } },
      create: { period: periodStr, dimension: 'gender', category: 'non_binary', value: 2 + Math.random() * 2, benchmark: 5 },
      update: {},
    });

    // Inclusion score
    await prisma.deiMetric.upsert({
      where: { period_dimension_category: { period: periodStr, dimension: 'inclusion', category: 'overall' } },
      create: { period: periodStr, dimension: 'inclusion', category: 'overall', value: 3.5 + Math.random() * 1, benchmark: 4.0 },
      update: {},
    });

    // Pay equity
    await prisma.deiMetric.upsert({
      where: { period_dimension_category: { period: periodStr, dimension: 'pay_equity', category: 'gender_gap' } },
      create: { period: periodStr, dimension: 'pay_equity', category: 'gender_gap', value: 3 + Math.random() * 5, benchmark: 0 },
      update: {},
    });

    deiCount += 5;
  }
  console.log(`  DEI metrics: ${deiCount}`);

  // ─── KPI Snapshots (historical) ───────────────────────
  let kpiCount = 0;
  const kpiDefs = [
    { id: 'headcount_total', moduleType: 'WORKFORCE' as const, unit: '', baseValue: 48, variance: 5 },
    { id: 'headcount_growth', moduleType: 'WORKFORCE' as const, unit: '%', baseValue: 3, variance: 4 },
    { id: 'turnover_rate', moduleType: 'LIFECYCLE' as const, unit: '%', baseValue: 8, variance: 5 },
    { id: 'retention_rate', moduleType: 'LIFECYCLE' as const, unit: '%', baseValue: 92, variance: 5 },
    { id: 'avg_tenure', moduleType: 'LIFECYCLE' as const, unit: 'mo', baseValue: 28, variance: 6 },
    { id: 'time_to_hire', moduleType: 'RECRUITMENT' as const, unit: 'days', baseValue: 35, variance: 15 },
    { id: 'offer_acceptance_rate', moduleType: 'RECRUITMENT' as const, unit: '%', baseValue: 78, variance: 12 },
    { id: 'training_hours', moduleType: 'DEVELOPMENT' as const, unit: 'hrs', baseValue: 25, variance: 15 },
    { id: 'engagement_score', moduleType: 'CULTURE' as const, unit: '', baseValue: 3.8, variance: 0.6 },
    { id: 'dei_ratio', moduleType: 'DEI' as const, unit: '', baseValue: 44, variance: 4 },
  ];

  for (let i = 5; i >= 0; i--) {
    const period = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodStr = `${period.getFullYear()}-${String(period.getMonth() + 1).padStart(2, '0')}`;

    for (const kpi of kpiDefs) {
      const value = kpi.baseValue + (Math.random() - 0.5) * kpi.variance;
      const previous = kpi.baseValue + (Math.random() - 0.5) * kpi.variance * 0.5;

      try {
        await prisma.kpiSnapshot.upsert({
          where: { kpiId_period: { kpiId: kpi.id, period: periodStr } },
          create: {
            kpiId: kpi.id,
            moduleType: kpi.moduleType,
            value: Math.round(value * 100) / 100,
            previousValue: Math.round(previous * 100) / 100,
            unit: kpi.unit,
            period: periodStr,
            calculatedAt: new Date(period.getFullYear(), period.getMonth(), 28),
          },
          update: {},
        });
        kpiCount++;
      } catch { /* skip duplicates */ }
    }
  }
  console.log(`  KPI snapshots: ${kpiCount}`);

  console.log('Demo data seeded successfully');
}
