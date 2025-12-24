# Digital Ocean Deployment Guide

## Quick Deploy to Digital Ocean

This guide walks you through deploying the GHL Task Management MVP to Digital Ocean.

---

## Prerequisites

1. **Digital Ocean Account** - Sign up at [digitalocean.com](https://www.digitalocean.com)
2. **GitHub Account** - For connecting your repo (optional but recommended)
3. **doctl** - Digital Ocean CLI tool installed locally
4. **Docker** - Installed and running
5. **Git** - Repository initialized

---

## Step 1: Prepare Your Repository

Your repository is already initialized. Now add a remote and push to GitHub:

```bash
# Add GitHub as remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/ghl-task-management.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Digital Ocean App Platform

### Option A: Using Digital Ocean CLI (Recommended)

```bash
# Login to Digital Ocean
doctl auth init

# Create an app spec file
cat > app.yaml << 'EOF'
name: ghl-task-management
services:
- name: api
  github:
    repo: yourusername/ghl-task-management
    branch: main
  build_command: cd apps/api && npm install --legacy-peer-deps && npm run build
  run_command: npm start
  envs:
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  - key: JWT_SECRET
    scope: RUN_TIME
    value: your-secret-key-here
  - key: GHL_CLIENT_ID
    scope: RUN_TIME
    value: your-ghl-client-id
  - key: GHL_CLIENT_SECRET
    scope: RUN_TIME
    value: your-ghl-client-secret
  - key: API_PORT
    scope: RUN_TIME
    value: "8080"
  http_port: 8080
  health_check:
    http_path: /health

- name: web
  github:
    repo: yourusername/ghl-task-management
    branch: main
  build_command: cd apps/web && npm install --legacy-peer-deps && npm run build
  run_command: npm start
  envs:
  - key: NEXT_PUBLIC_API_URL
    scope: BUILD_TIME
    value: https://api-${app.name}.ondigitalocean.app
  http_port: 3000
  health_check:
    http_path: /

databases:
- engine: PG
  name: ghl-db
  version: "14"

static_sites:
- name: docs
  source_dir: .

EOF

# Deploy
doctl apps create --spec app.yaml
```

### Option B: Using Digital Ocean Console (Web UI)

1. **Go to Apps Tab**
   - Click "Apps" in left sidebar
   - Click "Create Apps"

2. **Connect Repository**
   - Select "GitHub"
   - Authorize Digital Ocean
   - Select your repository
   - Select `main` branch

3. **Configure Services**

   **API Service:**
   - Source: Repository > `/apps/api`
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Run Command: `npm start`
   - Port: 8080
   - Environment Variables:
     - `DATABASE_URL`: (auto-set from database)
     - `JWT_SECRET`: (generate a strong key)
     - `GHL_CLIENT_ID`: (from GHL marketplace)
     - `GHL_CLIENT_SECRET`: (from GHL marketplace)

   **Web Service:**
   - Source: Repository > `/apps/web`
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Run Command: `npm start`
   - Port: 3000
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: https://api.yourapp.com

4. **Add Database**
   - Click "Database"
   - Choose "PostgreSQL 14"
   - Digital Ocean will auto-inject `DATABASE_URL`

5. **Deploy**
   - Review settings
   - Click "Create Resources"
   - Wait 5-10 minutes for deployment

---

## Step 3: Configure Environment Variables

Once deployed, update your environment variables in the Digital Ocean console:

```
// API Environment
JWT_SECRET=generate-a-strong-random-key
JWT_EXPIRATION=15m
GHL_CLIENT_ID=your-client-id-from-ghl
GHL_CLIENT_SECRET=your-client-secret-from-ghl
GHL_REDIRECT_URI=https://youapp.ondigitalocean.app/auth/ghl/callback
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=ghl-task-attachments

// Web Environment
NEXT_PUBLIC_API_URL=https://api-yourapp.ondigitalocean.app
```

---

## Step 4: Set Up GHL Marketplace Integration

1. **Go to GHL Developer Portal**
   - Login to [GHL Developer Account](https://developers.gohighlevel.com)
   - Create new OAuth Application

2. **Configure OAuth**
   - Application Name: "GHL Task Management"
   - Redirect URI: `https://yourapp.ondigitalocean.app/auth/ghl/callback`
   - Scopes: Select appropriate scopes for tasks, contacts, etc.

3. **Get Credentials**
   - Copy Client ID
   - Copy Client Secret
   - Add to Digital Ocean environment variables

---

## Step 5: Set Up Database & Run Migrations

Once deployed, SSH into your App Platform instance or use the console:

```bash
# Run Prisma migrations
npm run db:push

# Seed database (if you created seed script)
npm run db:seed
```

Or use Digital Ocean Console's "Run Command" feature:

```bash
# From Digital Ocean dashboard > Apps > Your App > Runtime
cd apps/api && npx prisma db push --skip-generate
```

---

## Step 6: Test Your Deployment

1. **Frontend**: Visit `https://yourapp.ondigitalocean.app`
   - Should see Next.js homepage

2. **API**: Visit `https://api-yourapp.ondigitalocean.app/auth/me`
   - Should get 401 Unauthorized (no token)

3. **OAuth Flow**: 
   - Click "Login with GHL"
   - Should redirect to GHL authorization
   - After auth, should see dashboard

---

## Troubleshooting

### Build Failures
```bash
# Check logs
doctl apps logs yourappidn --follow

# Rebuild
doctl apps update yourappidn
```

### Database Connection Issues
```bash
# Verify database is running
doctl databases get ghl-db

# Check connection string
doctl databases get ghl-db --format connection_string
```

### Environment Variables Not Set
```bash
# List all variables
doctl apps get yourappidn --format services

# Update a variable
doctl apps update yourappidn --spec app.yaml
```

---

## Cost Estimation

| Service | Cost/Month |
|---------|-----------|
| App Platform (API) | $12 |
| App Platform (Web) | $12 |
| PostgreSQL Database | $15+ |
| Storage (optional S3) | ~$5 |
| **Total** | **~$44+** |

---

## Next Steps After Deploy

1. **Monitor Logs**
   ```bash
   doctl apps logs yourappidn --follow
   ```

2. **Set Up Custom Domain**
   - In Digital Ocean console
   - Add your domain
   - Update DNS records

3. **Enable HTTPS** (Auto-enabled by default)

4. **Implement Monitoring**
   - Set up error tracking (Sentry)
   - Set up APM (New Relic, Datadog)
   - Enable logs export

5. **Backup Strategy**
   - Daily automated backups
   - Automated daily snapshots
   - Point-in-time recovery enabled

6. **Scaling**
   - Increase instance size as needed
   - Add read replicas for database
   - Enable CDN for static assets

---

## Rollback Process

If something goes wrong:

```bash
# View deployment history
doctl apps get yourappidn --format deployments

# Rollback to previous version
doctl apps deployments rollback yourappidn <deployment-id>
```

---

## Security Checklist

- [ ] JWT_SECRET is strong (64+ characters)
- [ ] GHL credentials are secure (use OAuth, not API keys)
- [ ] Database backups enabled
- [ ] Automated security updates enabled
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables not hardcoded

---

## Additional Resources

- [Digital Ocean Apps Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Digital Ocean CLI Reference](https://docs.digitalocean.com/reference/doctl/)
- [NestJS Deployment](https://docs.nestjs.com/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment/)

---

## Support

For issues:
1. Check Digital Ocean documentation
2. Review app logs: `doctl apps logs`
3. Check database connectivity
4. Verify environment variables
5. Check GHL API status

**Deployment Time: ~10 minutes**  
**Estimated Setup Time: ~30 minutes**

🚀 **Your MVP is live!**
