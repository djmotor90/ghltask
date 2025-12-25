FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN npm install --legacy-peer-deps

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build packages first, then apps
RUN cd packages/types && npm run build

# Generate Prisma client before building API
RUN cd apps/api && npx prisma generate

RUN cd apps/api && npm run build  
RUN cd apps/web && npm run build

# Create public directory if it doesn't exist
RUN mkdir -p apps/web/public

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install PM2 globally
RUN npm install -g pm2

# Copy built files and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Copy ecosystem config
COPY ecosystem.config.js ./

EXPOSE 3000 3001

ENV PORT=3000

# Start both services with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
