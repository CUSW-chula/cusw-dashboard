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
FROM oven/bun:latest-slim AS production

# Set working directory
WORKDIR /app

# Copy built application and package files
COPY --from=base /app/build ./build
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

# Expose port 5432
EXPOSE 5431

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5431
ENV HOST=0.0.0.0

# Start the application
CMD ["bun", "run", "start"]
