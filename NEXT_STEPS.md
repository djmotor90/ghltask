# Development Roadmap - Next Steps

This document outlines the immediate next steps after the foundation setup.

## Current Status
✅ **Phase 0 Complete** - Foundation Setup
- Monorepo structure with Turbo
- NestJS API with base modules
- Next.js frontend scaffolding
- Prisma schema with all tables
- Docker Compose environment
- Basic file structure and configs

## Immediate Next Steps (This Week)

### 1. **Test API Connectivity** (2-3 hours)
```bash
# Test if API starts without errors
cd apps/api
npm run dev

# Expected: "🚀 API server running on http://localhost:3001"
```

**Checklist:**
- [ ] API starts without errors
- [ ] Database connection works
- [ ] Prisma Client generates
- [ ] Can access http://localhost:3001

**If errors occur:**
1. Check `.env.local` configuration
2. Ensure PostgreSQL is running: `docker-compose ps`
3. Check logs: `docker-compose logs postgres`
4. Reinstall dependencies: `npm install`

---

### 2. **Complete GHL OAuth Integration** (4-6 hours)

**Files to modify:**
- `apps/api/src/modules/auth/auth.service.ts` ✅ Already done
- `apps/api/src/modules/auth/auth.controller.ts` ✅ Already done

**Frontend OAuth page:**
```bash
# Create auth pages in Next.js
# apps/web/src/app/auth/
```

**Steps:**
1. ✅ Backend OAuth endpoints ready
2. Create `/auth/login` page
3. Create `/auth/callback` page
4. Create `/auth/logout` endpoint
5. Test full OAuth flow

**Code to add:**

**`apps/web/src/app/auth/login/page.tsx`:**
```typescript
'use client';

import { useEffect } from 'react';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  useEffect(() => {
    const startOAuth = async () => {
      const { data } = await authApi.getAuthUrl();
      window.location.href = data.url;
    };
    startOAuth();
  }, []);

  return <div>Redirecting to GHL...</div>;
}
```

**`apps/web/src/app/auth/callback/page.tsx`:**
```typescript
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const handleCallback = async () => {
      try {
        const { data } = await authApi.handleCallback(code);
        setToken(data.accessToken);
        setUser(data.user);
        router.push('/dashboard');
      } catch (error) {
        console.error('OAuth callback failed:', error);
        router.push('/auth/error');
      }
    };

    handleCallback();
  }, [searchParams, router, setToken, setUser]);

  return <div>Processing authentication...</div>;
}
```

---

### 3. **Build Core UI Components** (6-8 hours)

Create reusable components in `apps/web/src/components/`:

```bash
mkdir -p src/components/{layout,tasks,common}
```

**Essential components:**

`src/components/layout/Sidebar.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function Sidebar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">TaskHub</h1>
      </div>
      <nav className="mt-8">
        <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-800">
          Dashboard
        </Link>
        <Link href="/tasks" className="block px-4 py-2 hover:bg-gray-800">
          Tasks
        </Link>
      </nav>
      <div className="absolute bottom-0 w-64 border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
```

`src/components/tasks/TaskCard.tsx`:
```typescript
import { Task } from '@types/ghl-task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded border border-gray-200 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="mt-2 flex justify-between text-xs">
        <span className={`px-2 py-1 rounded ${task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
}
```

---

### 4. **Build Dashboard Page** (4-5 hours)

Create `apps/web/src/app/dashboard/page.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { organizationsApi, spacesApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardPage() {
  const { data: org } = useQuery('organization', () =>
    organizationsApi.getProfile()
  );
  const { data: spaces } = useQuery('spaces', () =>
    spacesApi.getAll()
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        {org && <p className="text-gray-600">{org.data.name}</p>}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Spaces</h2>
          <div className="grid grid-cols-3 gap-4">
            {spaces?.data.map((space) => (
              <div key={space.id} className="p-4 bg-white rounded border">
                <h3 className="font-semibold">{space.name}</h3>
                <p className="text-sm text-gray-600">{space.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 1 Completion Checklist (This Week)

- [ ] GHL OAuth working end-to-end
- [ ] Login/callback pages functional
- [ ] Dashboard displays spaces and org info
- [ ] Basic UI components created
- [ ] Can create organizations in database
- [ ] Can list users in organization
- [ ] Error boundaries for API failures
- [ ] Loading states on pages

## Phase 2: Core Features (Next 2 Weeks)

### Tasks to Implement:
1. **Spaces API** - Full CRUD
2. **Folders API** - Full CRUD
3. **Lists API** - Full CRUD + Views
4. **Tasks API** - Full CRUD + Bulk operations
5. **Task Relationships** - Link, filter by relationship
6. **Subtasks API** - Create, complete, reorder
7. **Comments API** - Thread view, @mentions
8. **File Upload** - Attachments to S3

### UI to Build:
1. Space management page
2. Folder/List navigation
3. Task list view
4. Task detail modal
5. Comments section
6. Task creation form

---

## Important Files to Review

### Backend
- `apps/api/src/modules/auth/` - OAuth implementation
- `apps/api/prisma/schema.prisma` - Database structure
- `apps/api/src/common/` - Shared guards and decorators

### Frontend
- `apps/web/src/lib/api.ts` - API client
- `apps/web/src/store/` - State management
- `apps/web/src/components/` - UI components

---

## Testing the Foundation

```bash
# 1. Start all services
npm run dev

# 2. In another terminal, test API
curl http://localhost:3001/auth/ghl/authorize

# 3. Check frontend loads
open http://localhost:3000

# 4. View database
npm run db:studio
```

---

## Key Dependencies Already Installed

**Backend:**
- NestJS & dependencies ✅
- Prisma ✅
- JWT ✅
- Axios ✅

**Frontend:**
- Next.js 14 ✅
- React Query ✅
- Zustand ✅
- TailwindCSS ✅

---

## Common Issues & Solutions

**Issue:** "Cannot find module @types/ghl-task"
```bash
# Solution: Rebuild types package
cd packages/types && npm run build
```

**Issue:** "Prisma Client not generated"
```bash
# Solution:
npm run db:push
# or manually
cd apps/api && npx prisma generate
```

**Issue:** "Port 3001 already in use"
```bash
# Use different port
API_PORT=3002 npm run dev:api
```

---

## Success Criteria

When complete, you should have:
- ✅ Full OAuth flow working
- ✅ Authenticated users can see dashboard
- ✅ Dashboard displays spaces and org info
- ✅ Beautiful, responsive UI
- ✅ Error handling and loading states
- ✅ Clean, documented code

---

## Next Document to Read

After completing Phase 1, read:
- [API_REFERENCE.md](./docs/API_REFERENCE.md) - Detailed API documentation
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design patterns

---

## Need Help?

1. Check the [Troubleshooting Guide](./README.md#troubleshooting)
2. Review [QUICKSTART.md](./QUICKSTART.md)
3. Check source code comments
4. Look at similar implementations in the codebase

**Happy coding! 🚀**
