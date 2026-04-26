# BUILD
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN pnpm build && pnpm prune --prod

# RUNTIME
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 2022

RUN addgroup -S app && adduser -S app -G app

USER app

HEALTHCHECK CMD wget -q --spider http://localhost:2022/_health || exit 1

CMD ["node", "dist/main.js"]
