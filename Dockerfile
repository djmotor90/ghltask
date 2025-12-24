FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install all dependencies including PM2
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose ports
EXPOSE 3000 3001

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
