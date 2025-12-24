# GHL Task Management SaaS

A ClickUp-like task management application integrated with GoHighLevel (GHL) Marketplace.

## Features

- ✅ Multi-tenancy with organization isolation
- ✅ GHL OAuth integration
- ✅ Spaces, Folders, Lists, and Tasks
- ✅ Task relationships and subtasks
- ✅ Comments and attachments
- ✅ Custom fields with formula support
- ✅ Multiple views (List, Board, Calendar, Table)
- ✅ Real-time collaboration with WebSocket
- ✅ Full-text search
- ✅ Activity logging and audit trail

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma
- **Authentication**: JWT + GHL OAuth

### Frontend
- **Framework**: Next.js 14
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Real-time**: Socket.io

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker & Docker Compose
- Git

## Installation

### 1. Clone the repository
```bash
git clone <repo-url>
cd ghltask
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

#### Backend (.env.local)
```bash
cd apps/api
cp .env.example .env.local
# Edit .env.local with your configuration
```

#### Frontend (.env.local)
```bash
cd apps/web
# .env.local is already set up
```

### 4. Start databases
```bash
docker-compose up -d
```

### 5. Setup database
```bash
npm run db:push
npm run db:seed  # Optional: seed with sample data
```

### 6. Start development servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Prisma Studio: http://localhost:5555 (after running `npm run db:studio`)

## Project Structure

```
ghltask/
├── apps/
│   ├── api/                    # NestJS API
│   │   ├── src/
│   │   │   ├── modules/       # Feature modules
│   │   │   ├── common/        # Shared utilities
│   │   │   └── main.ts        # Entry point
│   │   └── prisma/            # Database schema
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/           # App router pages
│       │   ├── lib/           # Utilities and API client
│       │   ├── store/         # Zustand stores
│       │   └── components/    # React components
│       └── public/
├── packages/
│   └── types/                  # Shared TypeScript types
├── docker-compose.yml
└── package.json
```

## API Endpoints

### Authentication
- `GET /auth/ghl/authorize` - Get GHL OAuth authorization URL
- `GET /auth/ghl/callback` - Handle OAuth callback
- `GET /auth/me` - Get current user
- `GET /auth/refresh` - Refresh JWT token

### Organizations
- `GET /organizations/me` - Get org profile
- `GET /organizations/members` - Get org members

### Spaces
- `GET /spaces` - List all spaces
- `POST /spaces` - Create space
- `GET /spaces/:id` - Get space
- `PUT /spaces/:id` - Update space
- `DELETE /spaces/:id` - Delete space

### Tasks
- `GET /tasks/list/:listId` - List tasks by list
- `GET /tasks/:id` - Get task
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

(See IMPLEMENTATION_PLAN.md for complete API specification)

## Database Schema

The application uses PostgreSQL with the following main tables:
- `organizations` - Tenant/workspace
- `users` - Organization members
- `spaces` - Top-level workspace container
- `folders` - Collections within spaces
- `lists` - Task collections within folders
- `tasks` - Individual tasks
- `subtasks` - Subtasks within tasks
- `comments` - Task discussions
- `attachments` - File attachments
- `custom_fields` - Custom field definitions
- `task_field_values` - Custom field values per task
- `activity_log` - Audit trail

## Development

### Running Tests
```bash
npm run test
npm run test:e2e
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

### Database Management
```bash
npm run db:migrate          # Create new migration
npm run db:push            # Push schema to database
npm run db:reset           # Reset database (dev only)
npm run db:studio          # Open Prisma Studio
```

### Building
```bash
npm run build
```

### Production Start
```bash
npm run start
```

## GHL Marketplace Integration

To integrate with GHL Marketplace:

1. Register app at [GHL Developer Portal](https://developers.gohighlevel.com)
2. Configure OAuth credentials in `.env`
3. Set redirect URI to your app's callback endpoint
4. Submit for marketplace review
5. Users install directly from GHL interface

## Deployment

### Option 1: AWS (Recommended)
```bash
# Using ECS, Lambda, RDS, ElastiCache
# See deployment guide in docs/
```

### Option 2: Docker
```bash
docker build -f apps/api/Dockerfile -t ghl-task-api .
docker build -f apps/web/Dockerfile -t ghl-task-web .
```

### Option 3: Vercel (Frontend) + Cloud Run (API)
```bash
# Frontend: Push to GitHub, connect to Vercel
# API: Deploy to Google Cloud Run
```

## Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Detailed architecture and roadmap
- [API Documentation](./docs/API.md) - Complete API reference
- [Database Schema](./apps/api/prisma/schema.prisma) - Database structure

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Open Pull Request

## License

MIT

## Support

For issues and questions:
- GitHub Issues
- Email: support@yourdomain.com
- Discord: [Community Server]

## Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] AI task suggestions
- [ ] Advanced reporting
- [ ] Zapier/Make integrations
- [ ] Time tracking
- [ ] Team collaboration features
- [ ] Advanced formula engine
- [ ] Custom views builder

---

**Built with ❤️ for task management**
