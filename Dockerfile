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
RUN cd apps/api && npm run build  
RUN cd apps/web && npm run build

# Create public directory if it doesn't exist
RUN mkdir -p apps/web/public

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT=3000

# Start Next.js from the web directory
WORKDIR /app/apps/web
CMD ["../../node_modules/.bin/next", "start", "-p", "3000"]
