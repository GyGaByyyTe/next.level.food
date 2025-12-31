# Multi-stage Dockerfile for food.does.cool (Next.js + SQLite + MinIO client)

# 1) Build and install production deps (including better-sqlite3)
FROM node:22-bookworm-slim AS builder

# Do NOT set NODE_ENV=production in builder, we need devDeps (TypeScript) for build
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# System deps for native modules (better-sqlite3) and building
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     python3 make g++ pkg-config libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc.docker ./.npmrc

# Install all dependencies (incl. dev) for build-time (TypeScript, etc.)
RUN pnpm install --frozen-lockfile

# Explicitly rebuild better-sqlite3 to ensure native bindings are compiled
RUN cd node_modules/.pnpm/better-sqlite3@12.5.0/node_modules/better-sqlite3 && \
    npm run build-release

# Copy the rest of the app sources
COPY . .

# Build Next.js app
RUN pnpm run build

# Prune dev dependencies to keep only production for the runtime layer
RUN pnpm prune --prod


# 2) Runtime image
FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Install pnpm globally in runner image
RUN npm install -g pnpm@latest

# Runtime libs for better-sqlite3
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     libsqlite3-0 \
  && rm -rf /var/lib/apt/lists/*

# Create unprivileged user and data dir for SQLite
RUN useradd -m appuser \
  && mkdir -p /data \
  && chown -R appuser:appuser /data /app

# Copy only what is needed to run
COPY --from=builder --chown=appuser:appuser /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appuser /app/.next ./.next
COPY --from=builder --chown=appuser:appuser /app/public ./public

# initdb.js is used for first-run DB initialization (if present)
COPY --from=builder /app/initdb.js ./initdb.js

# Copy migrations and admin management scripts
COPY --from=builder --chown=appuser:appuser /app/migrations ./migrations
COPY --from=builder --chown=appuser:appuser /app/scripts ./scripts

# Entrypoint that links /app/meals.db → /data/meals.db and runs initdb.js if needed
COPY docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER appuser

# Next.js will read PORT
ENV PORT=3010
EXPOSE 3010

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["pnpm", "run", "start"]
