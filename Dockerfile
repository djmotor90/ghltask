FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install all dependencies
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Install PM2 globally
RUN npm install -g pm2

# Expose ports
EXPOSE 3000

# Start only Next.js (combined frontend+backend)
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
