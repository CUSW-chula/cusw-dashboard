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

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

# Copy built application and necessary files
COPY --from=base --chown=sveltekit:nodejs /app/build ./build
COPY --from=base --chown=sveltekit:nodejs /app/.svelte-kit ./.svelte-kit
COPY --from=base --chown=sveltekit:nodejs /app/package.json ./
COPY --from=base --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=sveltekit:nodejs /app/static ./static

# Switch to non-root user
USER sveltekit

# Expose port 5431
EXPOSE 5431

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5431
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1

# Start the application
CMD ["bun", "run", "start"]
