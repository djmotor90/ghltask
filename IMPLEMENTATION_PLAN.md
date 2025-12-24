# GHL Task Management SaaS - Implementation Plan

## Executive Summary
Building a multi-tenant task management application integrated with GoHighLevel (GHL) Marketplace, replicating ClickUp functionality with OAuth-based authentication, org-scoped data isolation, and advanced features like formulas, relationships, and real-time collaboration.

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     GHL Marketplace                              │
│            (OAuth Provider & Redirect Target)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    OAuth Authorization Code
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
    ┌───▼──────────────────┐         ┌───────────▼──────────────┐
    │   Web Application    │         │   Mobile App              │
    │   (React/Next.js)    │         │   (React Native/Flutter)  │
    │                      │         │                           │
    │  - UI Components     │         │  - Native UI              │
    │  - State Management  │         │  - Offline Sync           │
    │  - Real-time Updates │         │  - Push Notifications     │
    └────────┬─────────────┘         └────────────┬──────────────┘
             │                                    │
             └────────────────┬───────────────────┘
                              │
                    ┌─────────▼────────────┐
                    │  API Gateway / Auth  │
                    │  - JWT Validation    │
                    │  - GHL Token Exchange│
                    │  - Rate Limiting     │
                    │  - Request Routing   │
                    └─────────┬────────────┘
                              │
        ┌─────────────────────┴────────────────────┬──────────────────┐
        │                                          │                  │
    ┌───▼──────────────────┐  ┌──────────────────▼─┐  ┌──────────────▼┐
    │  Task Service        │  │  Organization      │  │  User/Auth    │
    │  - CRUD Operations   │  │  Service           │  │  Service      │
    │  - Task Relationships│  │  - Org Management  │  │  - GHL Sync   │
    │  - Formulas/Computed │  │  - Billing/Plan    │  │  - Roles      │
    │  - Webhooks          │  │  - Org Settings    │  │  - Sessions   │
    └────────┬─────────────┘  └────────┬───────────┘  └────────┬──────┘
             │                         │                        │
        ┌────▼─────────────────────────▼────────────────────────▼──────┐
        │              PostgreSQL Database                              │
        │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
        │  │ Organizations│  │    Tasks     │  │  Task_Relationships│ │
        │  │ Users        │  │ Task_Fields  │  │  Custom_Fields     │ │
        │  │ Folders      │  │ Attachments  │  │  Comments          │ │
        │  │ Lists        │  │ Comments     │  │  Activity Log      │ │
        │  └──────────────┘  └──────────────┘  └────────────────────┘ │
        └────────────────────────────────────────────────────────────┘
             │
        ┌────▼─────────────────────────────────────┐
        │  Cache Layer (Redis)                     │
        │  - Session Cache                         │
        │  - Query Cache                           │
        │  - Real-time Updates (Pub/Sub)           │
        │  - Presence Tracking                     │
        └──────────────────────────────────────────┘
             │
        ┌────▼──────────────────┐
        │  External Services    │
        │  - GHL API for Sync   │
        │  - File Storage (S3)  │
        │  - Email Service      │
        │  - Analytics          │
        └───────────────────────┘
```

### 1.2 Multi-Tenancy Model
- **Tenant Level**: Each GHL account/sub-account is a separate organization
- **Data Isolation**: Complete data segregation at database level
- **Authentication**: GHL OAuth → JWT token scoped to organization
- **Billing**: Per-org subscription management tied to GHL account

---

## 2. TECHNOLOGY STACK

### Frontend
- **Framework**: Next.js 14+ (React 18)
- **UI Library**: shadcn/ui + TailwindCSS or Material-UI
- **State Management**: TanStack Query (React Query) + Zustand
- **Real-time**: Socket.io or WebSocket
- **Editor**: Slate or TipTap for task descriptions/rich text
- **Drag & Drop**: dnd-kit or react-beautiful-dnd
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns or day.js

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: NestJS or Express.js + TypeORM/Prisma
- **API**: RESTful + GraphQL (optional for complex queries)
- **Authentication**: 
  - Passport.js (OAuth strategy for GHL)
  - JWT for session management
  - Refresh token rotation
- **Database ORM**: Prisma (recommended for schema versioning)
- **Validation**: Class-validator, Joi, or Zod

### Database
- **Primary**: PostgreSQL 15+
  - Row-level security (RLS) for multi-tenancy
  - JSONB for custom fields
  - Full-text search capability
  - Vector extensions for AI features (future)
- **Cache**: Redis 7+
  - Session store
  - Query cache
  - Pub/Sub for real-time updates
  - Rate limiting

### Infrastructure
- **Hosting**: AWS (ECS/Lambda), Google Cloud Run, or Railway
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions, GitLab CI, or Vercel
- **Monitoring**: Sentry, DataDog, or New Relic
- **Logging**: Winston, Pino, or ELK Stack
- **APM**: Application Performance Monitoring tool

### Storage
- **Files**: AWS S3 or Cloudinary
- **Presigned URLs**: For secure temporary file access

---

## 3. GHL MARKETPLACE INTEGRATION

### 3.1 OAuth Flow
```
User Click "Install" on GHL Marketplace
    ↓
Frontend redirects to GHL Authorization:
    https://oauth.gohighlevel.com/oauth/authorize?
    client_id=YOUR_CLIENT_ID&
    redirect_uri=https://app.yourdomain.com/auth/ghl/callback&
    response_type=code&
    state=RANDOM_STATE&
    scope=users:read+contacts:read+businesses:read
    ↓
User authorizes permissions in GHL
    ↓
GHL redirects to callback with Authorization Code
    ↓
Backend exchanges code for Access Token + Refresh Token
    ↓
Create/Update Organization record with GHL metadata
    ↓
Create default folders, lists, and sample tasks
    ↓
Redirect user to app dashboard
```

### 3.2 GHL API Integration Points
1. **User Sync**
   - Fetch GHL staff/users on install
   - Map GHL users to task management system
   - Sync on scheduled intervals (hourly)

2. **Contact Integration** (Optional)
   - Link tasks to GHL contacts
   - Display contact context in tasks
   - Auto-create tasks from GHL actions

3. **Webhook Handling**
   - Listen for user permission changes
   - Handle account suspension/deletion
   - Track usage for billing

### 3.3 Embedded Integration
- Iframe embed for GHL dashboard
- Subdomain approach: `tasks-{org_id}.yourdomain.com`
- Native mobile app with OAuth deep linking

---

## 4. DATABASE SCHEMA

### Core Tables

```sql
-- Organizations (Tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_account_id TEXT UNIQUE NOT NULL,
  ghl_sub_account_id TEXT,
  name TEXT NOT NULL,
  plan_type ENUM ('free', 'professional', 'enterprise'),
  status ENUM ('active', 'suspended', 'cancelled'),
  ghl_access_token TEXT NOT NULL ENCRYPTED,
  ghl_refresh_token TEXT ENCRYPTED,
  ghl_token_expires_at TIMESTAMP,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Users (GHL Staff mapped to App)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ghl_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role ENUM ('admin', 'manager', 'member', 'viewer'),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Spaces (Top-level workspace container)
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#5865F2',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Folders (Organize multiple lists)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color VARCHAR(7),
  position INTEGER,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Lists (Collections of tasks)
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status ENUM ('active', 'archived'),
  view_type ENUM ('list', 'board', 'calendar', 'table'),
  color VARCHAR(7),
  position INTEGER,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tasks (Main entity)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  status ENUM ('open', 'in_progress', 'in_review', 'done', 'archived'),
  priority ENUM ('urgent', 'high', 'normal', 'low'),
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP,
  
  -- Dates
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMP,
  
  -- Estimation
  estimated_hours DECIMAL(5,2),
  time_spent DECIMAL(8,2) DEFAULT 0,
  
  -- Visibility
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  -- Metadata
  custom_fields JSONB DEFAULT '{}',
  color VARCHAR(7),
  archived_at TIMESTAMP,
  
  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Task Relationships
CREATE TABLE task_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  target_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  relationship_type ENUM ('depends_on', 'related_to', 'blocks', 'duplicates'),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(source_task_id, target_task_id, relationship_type)
);

-- Assignments (Support multiple assignees)
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  UNIQUE(task_id, user_id)
);

-- Subtasks
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  position INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Custom Fields (Support formula fields)
CREATE TABLE custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  field_type ENUM (
    'text', 'number', 'select', 'multiselect', 
    'date', 'checkbox', 'formula', 'link'
  ),
  
  -- Configuration
  options JSONB, -- For select/multiselect
  formula TEXT, -- For formula fields
  linked_list_id UUID REFERENCES lists(id), -- For link fields
  
  required BOOLEAN DEFAULT false,
  position INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Task Field Values
CREATE TABLE task_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
  value JSONB,
  computed_value JSONB, -- For formula fields
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(task_id, field_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested replies
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  content_html TEXT, -- For rich text
  
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Attachments
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50),
  file_url TEXT NOT NULL,
  
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT now()
);

-- Activity Log (Audit trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type ENUM ('task', 'list', 'folder', 'comment', 'attachment'),
  entity_id UUID NOT NULL,
  action ENUM ('created', 'updated', 'deleted', 'commented'),
  
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  changes JSONB, -- Store before/after values
  
  created_at TIMESTAMP DEFAULT now(),
  INDEX (organization_id, created_at),
  INDEX (entity_type, entity_id)
);

-- Indexes for performance
CREATE INDEX idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX idx_tasks_list_id ON tasks(list_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_lists_folder_id ON lists(folder_id);
CREATE INDEX idx_folders_space_id ON folders(space_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_activity_organization_id ON activity_log(organization_id, created_at);
```

---

## 5. API STRUCTURE

### 5.1 REST Endpoints

```
/api/v1/
├── auth/
│   ├── POST /auth/ghl/authorize          # Start GHL OAuth
│   ├── GET  /auth/ghl/callback           # OAuth callback
│   ├── POST /auth/refresh                # Refresh JWT
│   └── POST /auth/logout                 # Revoke tokens
│
├── organizations/
│   ├── GET  /organizations/me            # Current org profile
│   ├── PUT  /organizations/me            # Update org settings
│   ├── GET  /organizations/members       # List org members (synced from GHL)
│   └── POST /organizations/sync-users    # Manual GHL sync
│
├── spaces/
│   ├── GET    /spaces                    # List spaces
│   ├── POST   /spaces                    # Create space
│   ├── GET    /spaces/{spaceId}          # Get space
│   ├── PUT    /spaces/{spaceId}          # Update space
│   └── DELETE /spaces/{spaceId}          # Delete space
│
├── folders/
│   ├── GET    /folders?spaceId=          # List folders
│   ├── POST   /folders                   # Create folder
│   ├── PUT    /folders/{folderId}        # Update folder
│   ├── DELETE /folders/{folderId}        # Delete folder
│   └── POST   /folders/{folderId}/reorder # Bulk reorder
│
├── lists/
│   ├── GET    /lists?folderId=&spaceId=  # List lists
│   ├── POST   /lists                     # Create list
│   ├── GET    /lists/{listId}            # Get list with tasks
│   ├── PUT    /lists/{listId}            # Update list
│   ├── DELETE /lists/{listId}            # Delete list
│   └── POST   /lists/{listId}/duplicate  # Duplicate list
│
├── tasks/
│   ├── GET    /tasks                     # List tasks (with filters)
│   ├── POST   /tasks                     # Create task
│   ├── GET    /tasks/{taskId}            # Get task details
│   ├── PUT    /tasks/{taskId}            # Update task
│   ├── PATCH  /tasks/{taskId}            # Partial update
│   ├── DELETE /tasks/{taskId}            # Delete task
│   ├── POST   /tasks/{taskId}/clone      # Duplicate task
│   ├── POST   /tasks/{taskId}/archive    # Archive task
│   ├── POST   /tasks/{taskId}/unarchive  # Unarchive task
│   ├── POST   /tasks/{taskId}/bulk-update # Bulk operations
│   ├── POST   /tasks/search              # Full-text search
│   │
│   ├── GET    /tasks/{taskId}/relationships # Get relationships
│   ├── POST   /tasks/{taskId}/relationships # Create relationship
│   ├── DELETE /tasks/{taskId}/relationships/{relationId}
│   │
│   ├── POST   /tasks/{taskId}/assign     # Assign user
│   ├── DELETE /tasks/{taskId}/assign/{userId}
│   │
│   ├── GET    /tasks/{taskId}/subtasks   # Get subtasks
│   ├── POST   /tasks/{taskId}/subtasks   # Create subtask
│   ├── PUT    /tasks/{taskId}/subtasks/{subtaskId}
│   ├── DELETE /tasks/{taskId}/subtasks/{subtaskId}
│   │
│   ├── POST   /tasks/{taskId}/comments   # Add comment
│   ├── GET    /tasks/{taskId}/comments   # Get comments with pagination
│   ├── PUT    /tasks/{taskId}/comments/{commentId}
│   ├── DELETE /tasks/{taskId}/comments/{commentId}
│   │
│   ├── POST   /tasks/{taskId}/attachments # Upload file
│   ├── DELETE /tasks/{taskId}/attachments/{attachmentId}
│   └── GET    /tasks/{taskId}/attachments/{attachmentId}/download
│
├── custom-fields/
│   ├── GET    /custom-fields?listId=     # List custom fields
│   ├── POST   /custom-fields             # Create field
│   ├── PUT    /custom-fields/{fieldId}   # Update field
│   ├── DELETE /custom-fields/{fieldId}   # Delete field
│   └── POST   /custom-fields/{fieldId}/recalculate # Recalc formulas
│
├── views/
│   ├── GET    /views?listId=             # List views
│   ├── POST   /views                     # Create view
│   ├── PUT    /views/{viewId}            # Update view (filters, grouping)
│   ├── DELETE /views/{viewId}            # Delete view
│   └── POST   /views/{viewId}/export     # Export view data
│
└── admin/
    ├── GET    /admin/organizations       # List all orgs (admin only)
    ├── GET    /admin/usage               # Usage analytics
    ├── POST   /admin/tasks/compute-formulas # Batch formula computation
    └── GET    /admin/health              # System health check
```

### 5.2 WebSocket Events (Real-time)
```
Connection
├── task:created          → Notify list subscribers
├── task:updated          → Notify task subscribers + @mentions
├── task:deleted          → Notify observers
├── task:comment:added    → Notify task subscribers
├── task:status:changed   → Notify assignees
├── user:presence:online  → Notify org
├── user:presence:offline → Notify org
└── task:locked           → Prevent concurrent edits
```

---

## 6. FEATURE IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)
- [ ] GHL OAuth integration & marketplace setup
- [ ] Multi-tenancy infrastructure
- [ ] User management & syncing from GHL
- [ ] Basic CRUD operations (spaces, folders, lists, tasks)
- [ ] Database schema & indexing
- [ ] Authentication & authorization layer
- [ ] Basic UI with Next.js

**Deliverable**: Functional task management with basic features

### Phase 2: Core Features (Weeks 5-8)
- [ ] Task relationships (depends on, blocks, etc.)
- [ ] Multiple assignees
- [ ] Subtasks
- [ ] Comments & mentions
- [ ] File attachments (S3 integration)
- [ ] Activity logging
- [ ] Search & filtering

**Deliverable**: Collaborative task management

### Phase 3: Advanced Features (Weeks 9-12)
- [ ] Custom fields (text, number, select, date, checkbox)
- [ ] Formula fields with expression engine
- [ ] Multiple views (list, board, calendar, table)
- [ ] Real-time collaboration (WebSocket)
- [ ] Task duplication & templating
- [ ] Bulk operations
- [ ] Webhooks for external integrations

**Deliverable**: ClickUp-like feature parity

### Phase 4: Polish & Scale (Weeks 13-16)
- [ ] Performance optimization
- [ ] Mobile app (React Native)
- [ ] Advanced filtering & saved views
- [ ] Analytics dashboard
- [ ] Export/import functionality
- [ ] Rate limiting & quota management
- [ ] Comprehensive documentation

**Deliverable**: Production-ready SaaS

### Phase 5: Growth (Ongoing)
- [ ] AI-powered task suggestions
- [ ] Time tracking automation
- [ ] Integration marketplace
- [ ] API for third-party apps
- [ ] Advanced reporting
- [ ] Team collaboration features

---

## 7. TECHNICAL IMPLEMENTATION DETAILS

### 7.1 Formula Engine
```typescript
interface FormulaContext {
  task: Task;
  fields: Record<string, any>;
  parentTask?: Task;
  subtasks?: Task[];
}

// Supported operations
- Basic math: +, -, *, /, %
- Comparisons: ==, !=, >, <, >=, <=
- Logical: AND, OR, NOT
- Functions: SUM, AVERAGE, COUNT, IF, CONCATENATE, LENGTH
- Field references: {field_name}
- Date operations: NOW(), DATE_DIFF()

Example: {estimated_hours} * 50 (Calculate cost)
Example: IF({status} == "done", {time_spent}, 0) (Track only completed)
```

### 7.2 Real-time Sync Strategy
```
User Action on Client
    ↓
Optimistic UI update
    ↓
Send to server via WebSocket/HTTP
    ↓
Server validates & updates DB
    ↓
Broadcast to other connected clients
    ↓
Clients merge server state with optimistic state
    ↓
Conflict resolution (CRDT or last-write-wins)
```

### 7.3 GHL Token Management
```typescript
// Store encrypted tokens
class OAuthService {
  async refreshGHLToken(org: Organization) {
    const newToken = await ghlClient.refreshToken(
      org.ghl_refresh_token
    );
    // Re-encrypt and store
    await org.update({
      ghl_access_token: encrypt(newToken.access_token),
      ghl_token_expires_at: newToken.expires_at
    });
  }
}

// Automatic refresh on each request
async function withGHLAuth(orgId: string) {
  const org = await getOrg(orgId);
  if (isTokenExpiring(org)) {
    await refreshGHLToken(org);
  }
  return org.ghl_access_token;
}
```

### 7.4 Multi-tenancy Isolation
```typescript
// Use organization_id in every query
const getTasksForOrg = (orgId: string, listId: string) => {
  return db.tasks.where({
    organization_id: orgId,
    list_id: listId
  });
};

// Middleware to enforce org context
async (req, res, next) => {
  const user = req.user; // From JWT
  req.organizationId = user.organization_id;
  
  // Ensure all queries use organization_id
  next();
};

// Row-level security in PostgreSQL
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON tasks
  FOR ALL USING (organization_id = current_user_id);
```

### 7.5 Indexing Strategy for Performance
```sql
-- Query patterns to optimize
-- 1. List all tasks in a list
CREATE INDEX idx_tasks_list_org ON tasks(list_id, organization_id, status);

-- 2. Find tasks assigned to user
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to, organization_id, due_date);

-- 3. Search within organization
CREATE INDEX idx_tasks_search ON tasks USING GIN(search_vector);

-- 4. Recent activity
CREATE INDEX idx_activity_org_date ON activity_log(organization_id, created_at DESC);

-- 5. Comment pagination
CREATE INDEX idx_comments_task_date ON comments(task_id, created_at DESC);
```

---

## 8. SECURITY CONSIDERATIONS

### 8.1 Authentication & Authorization
- [ ] GHL OAuth 2.0 with PKCE (if public app)
- [ ] JWT tokens with short expiration (15 min)
- [ ] Refresh tokens stored securely with HttpOnly cookies
- [ ] Role-based access control (admin, manager, member, viewer)
- [ ] Granular permissions per resource

### 8.2 Data Security
- [ ] AES-256 encryption for sensitive data (tokens, API keys)
- [ ] TLS 1.3+ for all communications
- [ ] Database encryption at rest
- [ ] Secrets management (AWS Secrets Manager, HashiCorp Vault)
- [ ] Audit logging for compliance

### 8.3 API Security
- [ ] CORS policies properly configured
- [ ] Rate limiting per IP/user
- [ ] Input validation & sanitization
- [ ] CSRF protection for state-changing operations
- [ ] SQL injection prevention via parameterized queries
- [ ] XSS prevention via content security policies

### 8.4 GHL Integration Security
- [ ] Validate OAuth state parameter
- [ ] Verify webhook signatures from GHL
- [ ] Never store plaintext GHL tokens
- [ ] Implement token refresh before expiration
- [ ] Log all GHL API interactions

---

## 9. DEPLOYMENT & INFRASTRUCTURE

### 9.1 Development Environment
```bash
docker-compose up
# Starts: PostgreSQL, Redis, API server, Frontend
```

### 9.2 Production Environment
```
Frontend: Vercel/Netlify or CloudFlare Pages
API: AWS ECS/Lambda or Google Cloud Run
Database: AWS RDS PostgreSQL
Cache: AWS ElastiCache Redis
Files: AWS S3
Monitoring: DataDog/Sentry
```

### 9.3 CI/CD Pipeline
```
Git Push → GitHub Actions
    ↓
Run tests & linting
    ↓
Build Docker images
    ↓
Push to registry
    ↓
Deploy to staging
    ↓
E2E tests
    ↓
Deploy to production
    ↓
Health checks & monitoring
```

---

## 10. MONITORING & ANALYTICS

### 10.1 Key Metrics
- Task creation rate
- User engagement (daily/monthly active)
- Average response time
- Error rates by endpoint
- Database query performance
- Storage usage per org
- GHL API sync success rate

### 10.2 Alerts
- API endpoint latency > 500ms
- Database query timeout
- Failed GHL sync for org
- Storage quota exceeded
- Authentication failures spike
- WebSocket connection drops

---

## 11. TESTING STRATEGY

### Unit Tests
- Service layer (60% coverage minimum)
- Utility functions (formula engine, validators)
- Database models

### Integration Tests
- API endpoints with mocked GHL
- Multi-tenancy isolation
- Task relationship cascades
- Formula computation

### E2E Tests
- Complete user flows (auth → task creation → collaboration)
- Real-time updates
- File uploads
- Search functionality

### Load Testing
- 1000 concurrent users
- High-volume task creation
- Large comment threads
- Formula recalculation

---

## 12. MIGRATION & ROLLOUT

### 12.1 GHL Marketplace Submission
1. Create GHL marketplace account
2. Register app with OAuth credentials
3. Create marketing materials & documentation
4. Submit for review (includes security audit)
5. Get approved and published
6. Enable marketplace distribution

### 12.2 Customer Onboarding
1. User clicks "Install" in GHL
2. OAuth authorization
3. Automatic GHL user sync
4. Welcome tutorial/onboarding
5. Create first project template
6. Import sample data (optional)

---

## 13. COST ESTIMATION

### Infrastructure (per month)
- Frontend hosting: $20-50
- API server: $50-200 (auto-scaled)
- Database: $30-100
- Cache: $10-30
- File storage: $10-50 (per TB)
- CDN/DDoS protection: $20-100
- Monitoring/Logging: $50-200
- **Total**: ~$190-730/month baseline

### Per-Organization (SaaS costs)
- Free: $0 (1 folder, 5 lists, basic features)
- Professional: $29/month (unlimited lists, custom fields)
- Enterprise: $99/month (formulas, webhooks, advanced)

---

## 14. TIMELINE & RESOURCE REQUIREMENTS

### Team Composition
- Full-stack engineers: 2-3
- Frontend engineer: 1
- DevOps/Infrastructure: 1 (part-time)
- Product manager: 1
- Designer/UX: 1 (part-time)

### Timeline
- MVP (Core features): 4 months
- Advanced features: 2-3 months additional
- Production launch: 6+ months total

---

## 15. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| GHL API changes | High | Version API, monitor GHL changelog, maintain compatibility |
| Multi-tenancy bugs | High | Extensive testing, audit logging, staging environment |
| Performance at scale | High | Database indexing, caching, load testing, auto-scaling |
| User onboarding | Medium | Analytics, user interviews, improve UX iteratively |
| Data migration from competitors | Medium | Import tools, data mapping, careful validation |
| Marketplace approval delays | Medium | Early communication with GHL, follow guidelines strictly |

---

## NEXT STEPS

1. **Week 1**: Set up GHL developer account and marketplace registration
2. **Week 1**: Initialize monorepo with frontend/backend structure
3. **Week 2**: Implement GHL OAuth flow
4. **Week 2-3**: Build database schema and ORM setup
5. **Week 3**: Implement basic CRUD API
6. **Week 4**: Build React frontend with basic UI
7. **Continue with Phase 1 items...**

---

## REFERENCES

- [GHL Developer Docs](https://developers.gohighlevel.com)
- [ClickUp API Reference](https://developer.clickup.com)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
