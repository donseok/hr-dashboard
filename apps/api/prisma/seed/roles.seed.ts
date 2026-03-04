import { PrismaClient } from '@prisma/client';

const ROLES = [
  {
    name: 'ADMIN',
    description: 'System administrator with full access',
    isSystem: true,
    permissions: [
      'dashboard:view', 'dashboard:edit',
      'employee:view', 'employee:edit', 'employee:create', 'employee:delete',
      'report:view', 'report:export',
      'settings:view', 'settings:edit',
      'analytics:view', 'analytics:advanced',
      'recruitment:view', 'recruitment:edit', 'recruitment:create',
      'performance:view', 'performance:edit',
      'training:view', 'training:edit',
      'dei:view', 'dei:edit',
      'survey:view', 'survey:edit', 'survey:create',
      'user:view', 'user:edit', 'user:create', 'user:delete',
    ],
  },
  {
    name: 'HR_SPECIALIST',
    description: 'HR specialist with full HR data access',
    isSystem: true,
    permissions: [
      'dashboard:view', 'dashboard:edit',
      'employee:view', 'employee:edit', 'employee:create',
      'report:view', 'report:export',
      'analytics:view', 'analytics:advanced',
      'recruitment:view', 'recruitment:edit', 'recruitment:create',
      'performance:view', 'performance:edit',
      'training:view', 'training:edit',
      'dei:view', 'dei:edit',
      'survey:view', 'survey:edit', 'survey:create',
    ],
  },
  {
    name: 'MANAGER',
    description: 'Department manager with team-level access',
    isSystem: true,
    permissions: [
      'dashboard:view',
      'employee:view',
      'report:view',
      'analytics:view',
      'recruitment:view', 'recruitment:create',
      'performance:view', 'performance:edit',
      'training:view',
      'survey:view',
    ],
  },
  {
    name: 'EXECUTIVE',
    description: 'Executive with organization-wide read access and summary views',
    isSystem: true,
    permissions: [
      'dashboard:view',
      'employee:view',
      'report:view', 'report:export',
      'analytics:view', 'analytics:advanced',
      'recruitment:view',
      'performance:view',
      'training:view',
      'dei:view',
      'survey:view',
    ],
  },
];

export async function seedRoles(prisma: PrismaClient) {
  console.log('Seeding roles...');

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      create: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: role.permissions,
      },
      update: {
        description: role.description,
        permissions: role.permissions,
      },
    });
    console.log(`  Role: ${role.name}`);
  }

  console.log('Roles seeded successfully');
}
