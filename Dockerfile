# Use the official Bun image as base
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1.2-slim AS production

# Set working directory
WORKDIR /app

# Copy built application and all files
COPY --from=base /app ./

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 5432
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV VITE_IS_DEV=no
EXPOSE 4173

# Start the application
ENTRYPOINT ["/entrypoint.sh"]
