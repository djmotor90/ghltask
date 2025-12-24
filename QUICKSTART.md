# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
# Install all workspace dependencies
npm install
```

### Step 2: Start Docker Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Step 3: Setup Database
```bash
# Generate Prisma Client
npm run db:push

# (Optional) Seed sample data
npm run db:seed
```

### Step 4: Configure Environment

**Backend** (`apps/api/.env.local`):
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/ghl_task_db"
NODE_ENV="development"
JWT_SECRET="dev-secret-key-change-in-prod"
JWT_EXPIRATION="15m"
GHL_CLIENT_ID="your-ghl-client-id"
GHL_CLIENT_SECRET="your-ghl-client-secret"
GHL_REDIRECT_URI="http://localhost:3000/auth/callback"
API_PORT=3001
WEB_URL="http://localhost:3000"
```

**Frontend** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### Step 5: Start Development Servers
```bash
# Start both frontend (port 3000) and API (port 3001) with watch mode
npm run dev

# In separate terminals:
# cd apps/api && npm run dev
# cd apps/web && npm run dev
```

### Step 6: Verify Installation
- Frontend: http://localhost:3000
- API Docs: http://localhost:3001/api
- Prisma Studio: http://localhost:5555 (run `npm run db:studio`)

## Common Tasks

### View Database
```bash
npm run db:studio
```

### Run Tests
```bash
npm run test
```

### Format Code
```bash
npm run format
```

### Build for Production
```bash
npm run build
```

## GHL OAuth Setup

To test OAuth locally:

1. Register at [GHL Developer Portal](https://developers.gohighlevel.com)
2. Create OAuth app with redirect URI: `http://localhost:3000/auth/callback`
3. Copy `client_id` and `client_secret`
4. Add to `.env.local`:
   ```
   GHL_CLIENT_ID=your_client_id
   GHL_CLIENT_SECRET=your_client_secret
   ```

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Recreate database
npm run db:reset
```

### Port Already in Use
```bash
# Backend on different port
API_PORT=3002 npm run dev:api

# Frontend on different port
npm run dev -- -p 3001
```

### Clear Node Modules
```bash
rm -rf node_modules apps/*/node_modules
npm install
```

## File Structure Overview

```
ghltask/
├── apps/
│   ├── api/           # NestJS backend
│   └── web/           # Next.js frontend
├── packages/
│   └── types/         # Shared types
├── docker-compose.yml # Local dev services
└── package.json       # Workspace root
```

## Next Steps

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Check [API endpoints](./README.md#api-endpoints)
3. Explore `/apps/api/src/modules` for backend structure
4. Check `/apps/web/src` for frontend structure

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [GHL API Docs](https://developers.gohighlevel.com)

## Getting Help

1. Check the [troubleshooting guide](#troubleshooting)
2. View Docker logs: `docker-compose logs -f [service]`
3. Check API logs in terminal
4. Open an issue on GitHub
