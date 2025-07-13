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

# Expose port 5432
<<<<<<< HEAD
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
=======
EXPOSE 4173

# Set environment variables
ENV NODE_ENV=production
>>>>>>> 2a84401225e6a05949705351427de54639a6d50e

# Start the application
CMD ["bun", "run", "preview"]