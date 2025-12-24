# Digital Ocean Deployment with PM2

## Quick Setup (15 minutes)

### 1. Create Droplet
- Go to **DigitalOcean → Create → Droplet**
- **OS**: Ubuntu 22.04 (LTS)
- **Size**: Basic ($6/month or higher)
- **Region**: Choose closest to you
- **SSH Key**: Add your SSH public key
- Click **Create Droplet**

### 2. SSH into Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

### 3. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server

# Install PM2 globally
npm install -g pm2

# Install Nginx (for reverse proxy)
apt install -y nginx
```

### 4. Clone Repository
```bash
cd /home
git clone https://github.com/YOUR_USERNAME/ghltask.git
cd ghltask

# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build
```

### 5. Set Up Environment Variables
```bash
# API environment
cat > apps/api/.env.local << 'EOF'
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ghl_task_db"
NODE_ENV=production
JWT_SECRET="your-production-jwt-secret-change-this"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

GHL_CLIENT_ID="694b895ff0d10a18ad4ee6c1-mjjnug2k"
GHL_CLIENT_SECRET="7e843e88-b894-4b28-ab05-f759ca4ef8fc"
GHL_REDIRECT_URI="https://YOUR_DOMAIN.com/auth/callback"
GHL_API_BASE_URL="https://api.gohighlevel.com"

API_PORT=3001
API_URL="https://YOUR_DOMAIN.com/api"
WEB_URL="https://YOUR_DOMAIN.com"

REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
EOF

# Frontend environment
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.YOUR_DOMAIN.com
NEXT_PUBLIC_WEB_URL=https://YOUR_DOMAIN.com
EOF
```

### 6. Set Up PostgreSQL
```bash
sudo -u postgres psql << 'EOF'
CREATE DATABASE ghl_task_db;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE ghl_task_db TO postgres;
\q
EOF

# Run migrations
cd /home/ghltask
npx prisma migrate deploy
```

### 7. Configure Nginx as Reverse Proxy
```bash
cat > /etc/nginx/sites-available/ghltask << 'EOF'
upstream api_backend {
  server 127.0.0.1:3001;
}

upstream web_backend {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name YOUR_DOMAIN.com api.YOUR_DOMAIN.com;
  
  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name YOUR_DOMAIN.com;

  ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem;

  # Frontend
  location / {
    proxy_pass http://web_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

server {
  listen 443 ssl http2;
  server_name api.YOUR_DOMAIN.com;

  ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem;

  # API
  location / {
    proxy_pass http://api_backend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/ghltask /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl restart nginx
```

### 8. Set Up SSL Certificate (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot certonly --nginx -d YOUR_DOMAIN.com -d api.YOUR_DOMAIN.com

# Auto-renewal (runs daily)
systemctl enable certbot.timer
```

### 9. Start with PM2
```bash
cd /home/ghltask

# Build production code
npm run build

# Start apps with PM2
pm2 start ecosystem.config.js --env production

# Make PM2 auto-start on reboot
pm2 startup
pm2 save
```

### 10. Monitor
```bash
# View logs
pm2 logs

# View status
pm2 status

# Restart apps
pm2 restart all

# Stop apps
pm2 stop all
```

## DNS Setup

1. Add DNS A record:
   - **Host**: `@` (for YOUR_DOMAIN.com)
   - **Value**: YOUR_DROPLET_IP

2. Add DNS CNAME record:
   - **Host**: `api`
   - **Value**: YOUR_DOMAIN.com

Wait 5-10 minutes for DNS to propagate.

## Update GHL App Settings

In GHL Developer Portal:
- **Redirect URI**: `https://YOUR_DOMAIN.com/auth/callback`
- **App URL**: `https://YOUR_DOMAIN.com`

## Production Checklist

- [ ] Domain pointing to Droplet
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] Database migrated
- [ ] PM2 running both apps
- [ ] Nginx proxying correctly
- [ ] GHL app credentials updated
- [ ] Test OAuth flow at https://YOUR_DOMAIN.com

## Monitoring & Logs

```bash
# Real-time logs
pm2 logs

# API logs only
pm2 logs ghl-api

# Web logs only
pm2 logs ghl-web

# View in browser (PM2 Plus)
pm2 web
```

## Scaling

```bash
# Increase API instances to 4
pm2 scale ghl-api 4

# Increase Web instances to 3
pm2 scale ghl-web 3

# Save config
pm2 save
```

That's it! Your app is now live with full OAuth support and internet access.
