FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY . .

RUN yarn build
