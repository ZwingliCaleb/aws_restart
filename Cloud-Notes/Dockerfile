# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

# Install only production deps first for better caching
COPY package*.json ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Reuse deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy only what's needed to run the app
COPY --from=builder /app/package*.json   ./
COPY --from=builder /app/node_modules    ./node_modules
COPY --from=builder /app/.next           ./.next
COPY --from=builder /app/public          ./public

# Seed data dir — will be overridden by a Docker volume in production
RUN mkdir -p ./data && chown -R nextjs:nodejs ./data
COPY --from=builder --chown=nextjs:nodejs /app/data/notes.json ./data/notes.json

USER nextjs

EXPOSE 3000

# Healthcheck so Docker/ACI knows when the app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/ || exit 1

CMD ["node_modules/.bin/next", "start"]
