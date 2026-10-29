FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Install production dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Runtime image
FROM base AS release
ENV NODE_ENV=production

COPY --from=install /usr/src/app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

CMD ["bun", "run", "src/index.ts"]