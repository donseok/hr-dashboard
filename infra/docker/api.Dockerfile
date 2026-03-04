FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN pnpm --filter api build
RUN pnpm --filter api --prod deploy pruned

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nestjs /app/pruned/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/pruned/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/prisma ./prisma

USER nestjs
EXPOSE 4000

CMD ["node", "dist/main.js"]
