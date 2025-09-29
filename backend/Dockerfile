# --- Stage 1: Build TS inside Docker ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Compile TypeScript (will emit JS even if errors exist)
RUN npm run build

# --- Stage 2: Run app ---
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Copy any runtime files if needed
# COPY public ./public

EXPOSE 3000

CMD ["node", "dist/index.js"]
