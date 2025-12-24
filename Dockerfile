FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps ./apps
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Start with PM2
CMD ["npm", "run", "start:pm2"]
