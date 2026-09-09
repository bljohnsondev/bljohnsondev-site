# syntax=docker/dockerfile:1
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG STATUS_FILE_PATH

RUN --mount=type=secret,id=ATPROTO_HANDLE \
    ATPROTO_HANDLE=$(cat /run/secrets/ATPROTO_HANDLE) \
    STATUS_FILE_PATH="${STATUS_FILE_PATH}" \
    pnpm build


FROM node:22-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/build ./build

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "build/index.js"]
