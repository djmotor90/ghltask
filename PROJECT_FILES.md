# Project File Structure & Documentation

## 📁 Complete Directory Tree

```
ghltask/
│
├── 📄 Root Configuration Files
│   ├── package.json              # Workspace root - Turbo config
│   ├── tsconfig.json             # TypeScript root config
│   ├── turbo.json                # Turbo monorepo config
│   ├── .prettierrc               # Code formatting
│   ├── .eslintrc.json            # Linting rules
│   ├── .gitignore                # Git ignore rules
│   ├── docker-compose.yml        # Local dev environment
│   │
│   ├── 📚 Documentation
│   ├── README.md                 # Project overview
│   ├── QUICKSTART.md             # 5-minute setup guide
│   ├── NEXT_STEPS.md             # Immediate development tasks
│   ├── IMPLEMENTATION_PLAN.md    # Complete architecture & roadmap
│   └── PROJECT_FILES.md          # This file
│
├── 📦 packages/
│   └── types/                    # Shared TypeScript types
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts          # All shared types & interfaces
│
├── 🚀 apps/
│   │
│   ├── api/                      # NestJS Backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   ├── test/
│   │   │   └── jest-e2e.json
│   │   │
│   │   ├── .env.example          # Environment template
│   │   ├── .env.local            # Local development
│   │   │
│   │   ├── prisma/
│   │   │   └── schema.prisma     # Complete database schema
│   │   │
│   │   └── src/
│   │       ├── main.ts           # Application entry point
│   │       ├── app.module.ts     # Root module
│   │       │
│   │       ├── common/           # Shared utilities
│   │       │   ├── prisma/
│   │       │   │   ├── prisma.service.ts
│   │       │   │   └── prisma.module.ts
│   │       │   ├── guards/
│   │       │   │   └── jwt-auth.guard.ts
│   │       │   └── decorators/
│   │       │       └── user.decorator.ts
│   │       │
│   │       └── modules/          # Feature modules
│   │           ├── auth/
│   │           │   ├── auth.service.ts       # GHL OAuth logic
│   │           │   ├── auth.controller.ts    # OAuth endpoints
│   │           │   └── auth.module.ts
│   │           ├── organizations/
│   │           │   ├── organizations.service.ts
│   │           │   ├── organizations.controller.ts
│   │           │   └── organizations.module.ts
│   │           ├── users/
│   │           │   ├── users.service.ts
│   │           │   └── users.module.ts
│   │           ├── spaces/
│   │           │   ├── spaces.service.ts
│   │           │   ├── spaces.controller.ts
│   │           │   └── spaces.module.ts
│   │           ├── folders/
│   │           │   ├── folders.service.ts
│   │           │   └── folders.module.ts
│   │           ├── lists/
│   │           │   ├── lists.service.ts
│   │           │   └── lists.module.ts
│   │           ├── tasks/
│   │           │   ├── tasks.service.ts     # Core task logic
│   │           │   ├── tasks.controller.ts  # Task endpoints
│   │           │   └── tasks.module.ts
│   │           ├── custom-fields/
│   │           │   ├── custom-fields.service.ts
│   │           │   └── custom-fields.module.ts
│   │           ├── comments/
│   │           │   ├── comments.service.ts
│   │           │   └── comments.module.ts
│   │           └── attachments/
│   │               ├── attachments.service.ts
│   │               └── attachments.module.ts
│   │
│   └── web/                      # Next.js Frontend
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       │
│       ├── .env.local            # Environment variables
│       │
│       └── src/
│           ├── app/              # Next.js App Router
│           │   ├── layout.tsx    # Root layout
│           │   ├── page.tsx      # Home page
│           │   ├── globals.css   # Global styles
│           │   ├── auth/
│           │   │   ├── login/
│           │   │   │   └── page.tsx      # OAuth login
│           │   │   └── callback/
│           │   │       └── page.tsx      # OAuth callback
│           │   └── dashboard/
│           │       └── page.tsx  # Main dashboard
│           │
│           ├── lib/              # Utilities
│           │   ├── api-client.ts # Axios config
│           │   └── api.ts        # API endpoints
│           │
│           ├── store/            # State management (Zustand)
│           │   ├── auth.ts       # Auth state
│           │   └── tasks.ts      # Tasks state
│           │
│           └── components/       # React components
│               ├── layout/
│               │   └── Sidebar.tsx
│               ├── tasks/
│               │   └── TaskCard.tsx
│               └── common/
│                   └── (reusable components)
```

---

## 📋 File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Workspace root with npm scripts & dependencies |
| `tsconfig.json` | Base TypeScript configuration for all apps |
| `turbo.json` | Turbo monorepo pipeline config |
| `.prettierrc` | Code formatting rules |
| `.eslintrc.json` | ESLint configuration |
| `docker-compose.yml` | PostgreSQL & Redis setup |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview, features, setup, deployment |
| `QUICKSTART.md` | Fast 5-minute setup guide |
| `NEXT_STEPS.md` | Immediate development tasks with code examples |
| `IMPLEMENTATION_PLAN.md` | Complete architecture, database schema, API spec |
| `PROJECT_FILES.md` | This file - guide to project structure |

### Backend (NestJS)

| File | Purpose |
|------|---------|
| `apps/api/src/main.ts` | Application entry point |
| `apps/api/src/app.module.ts` | Root module - imports all feature modules |
| `apps/api/.env.local` | Development environment variables |
| `apps/api/prisma/schema.prisma` | Complete database schema (all tables) |
| `apps/api/src/common/prisma/` | Database service & module |
| `apps/api/src/common/guards/jwt-auth.guard.ts` | JWT authentication guard |
| `apps/api/src/common/decorators/user.decorator.ts` | Custom decorators for user data |
| `apps/api/src/modules/auth/` | GHL OAuth integration |
| `apps/api/src/modules/*/` | Services & controllers for each entity |

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `apps/web/src/app/layout.tsx` | Root layout component |
| `apps/web/src/app/page.tsx` | Home page |
| `apps/web/src/app/globals.css` | Global Tailwind styles |
| `apps/web/.env.local` | Frontend environment variables |
| `apps/web/src/lib/api-client.ts` | Axios client with interceptors |
| `apps/web/src/lib/api.ts` | API endpoint definitions |
| `apps/web/src/store/auth.ts` | Zustand auth state |
| `apps/web/src/store/tasks.ts` | Zustand tasks state |
| `apps/web/src/components/` | Reusable React components |

### Shared Types

| File | Purpose |
|------|---------|
| `packages/types/src/index.ts` | All TypeScript interfaces & types |

---

## 🏗️ Architecture Overview

### Database Schema (Prisma)
```
Organization (Tenant)
  ├── User (Members)
  ├── Space (Workspace container)
  │   ├── Folder (Collections)
  │   │   └── List (Task collections)
  │   │       ├── Task (Items)
  │   │       │   ├── Subtask
  │   │       │   ├── Comment (with replies)
  │   │       │   ├── Attachment
  │   │       │   └── TaskFieldValue
  │   │       │
  │   │       └── CustomField (Field definitions)
  │   │
  │   └── List (Can exist independently)
  │
  ├── TaskRelationship (Task links)
  └── ActivityLog (Audit trail)
```

### API Layers

```
Client Request
    ↓
Controller (route handling)
    ↓
Service (business logic)
    ↓
Prisma (ORM)
    ↓
PostgreSQL
```

### Frontend State Flow

```
User Action
    ↓
Component (UI)
    ↓
Zustand Store (local state)
    ↓
React Query (server state)
    ↓
API Client
    ↓
Backend API
    ↓
Database
```

---

## 🔑 Key Files to Know

### Must-Read Files (In Order)
1. **README.md** - Overview and setup
2. **QUICKSTART.md** - Get running in 5 minutes
3. **NEXT_STEPS.md** - What to build next
4. **apps/api/prisma/schema.prisma** - Database structure
5. **apps/api/src/modules/auth/** - OAuth implementation
6. **IMPLEMENTATION_PLAN.md** - Complete API specification

### Important Service Files
- **Auth Service** - `apps/api/src/modules/auth/auth.service.ts` - GHL OAuth
- **Tasks Service** - `apps/api/src/modules/tasks/tasks.service.ts` - Task CRUD
- **API Client** - `apps/web/src/lib/api.ts` - Frontend API calls
- **Auth Store** - `apps/web/src/store/auth.ts` - User state

---

## 📊 Current Implementation Status

### Completed (Foundation) ✅
- [x] Monorepo setup with Turbo
- [x] NestJS with all modules scaffolded
- [x] Next.js with app router
- [x] Prisma schema (all tables)
- [x] Base services and controllers
- [x] Docker environment
- [x] Configuration and types

### Ready to Build (This Week) 🔨
- [ ] GHL OAuth testing
- [ ] Login/callback pages
- [ ] Dashboard with spaces
- [ ] Core UI components
- [ ] Error handling

### Coming Next (Weeks 2-4) 📅
- [ ] Full CRUD for all entities
- [ ] Task relationships
- [ ] Comments and attachments
- [ ] Custom fields and formulas
- [ ] Multiple views (Board, Calendar)
- [ ] WebSocket real-time

### Future Phases 🚀
- [ ] File uploads to S3
- [ ] Advanced search
- [ ] Webhooks
- [ ] Mobile apps
- [ ] Analytics dashboard

---

## 🚀 How to Navigate the Code

### Adding a New Feature
1. Create module in `apps/api/src/modules/{feature}`
2. Add model to `apps/api/prisma/schema.prisma`
3. Implement service with business logic
4. Create controller with endpoints
5. Export module in `app.module.ts`
6. Create API methods in `apps/web/src/lib/api.ts`
7. Create components in `apps/web/src/components`
8. Create store in `apps/web/src/store` if needed
9. Create pages in `apps/web/src/app`

### Database Changes
1. Modify `apps/api/prisma/schema.prisma`
2. Run `npm run db:migrate "description"`
3. Test with `npm run db:studio`

### Adding Components
1. Create in `apps/web/src/components/category/`
2. Export from `index.ts` if creating a group
3. Use in pages with `import { Component } from '@/components'`

### Testing the API
1. Start API: `cd apps/api && npm run dev`
2. Test endpoint: `curl http://localhost:3001/auth/ghl/authorize`
3. View in Prisma Studio: `npm run db:studio`

---

## 📝 Code Organization Principles

- **Services** - Pure business logic, no HTTP knowledge
- **Controllers** - Route handling, call services
- **Decorators** - Custom @CurrentUser, @OrgId extraction
- **Guards** - Authentication, authorization
- **Components** - Reusable, prop-driven React UI
- **Stores** - Client-side state with Zustand
- **Hooks** - Custom React hooks (create as needed)

---

## 🔗 Important Links

### External Documentation
- [NestJS](https://docs.nestjs.com) - Backend framework
- [Next.js](https://nextjs.org/docs) - Frontend framework
- [Prisma](https://www.prisma.io/docs) - ORM
- [GHL API](https://developers.gohighlevel.com) - OAuth & integration
- [TailwindCSS](https://tailwindcss.com/docs) - Styling

### Internal Documents
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Architecture deep-dive
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap
- [README.md](./README.md) - Project overview

---

## 💡 Development Tips

### Fast Local Development
```bash
# Watch mode for both apps
npm run dev

# Just backend
cd apps/api && npm run dev

# Just frontend
cd apps/web && npm run dev
```

### Database Inspection
```bash
# Visual database browser
npm run db:studio

# Reset database (dev only)
npm run db:reset

# Create migration
npm run db:migrate "description"
```

### Testing Components
Create test files next to components:
```
components/
├── TaskCard.tsx
└── TaskCard.test.tsx
```

### Code Quality
```bash
npm run lint      # Check code
npm run format    # Auto-format
npm run test      # Run tests
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - Use `.env.example` template
2. **Database schema changes** - Always create migrations
3. **API changes** - Update types in `packages/types/`
4. **Large files** - Use AWS S3 for attachments
5. **Real-time** - Use WebSocket for live updates
6. **Multi-tenancy** - Always filter by `organization_id`

---

## 📞 Support Resources

- **File not found?** Check `PROJECT_FILES.md`
- **How to start?** Read `QUICKSTART.md`
- **API endpoints?** See `IMPLEMENTATION_PLAN.md`
- **Next task?** Check `NEXT_STEPS.md`
- **Architecture?** Read `IMPLEMENTATION_PLAN.md`

---

**Last Updated:** December 24, 2025
**Project:** GHL Task Management SaaS
**Status:** Foundation Complete - Ready for Development
