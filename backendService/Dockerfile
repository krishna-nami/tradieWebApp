# Dockerfile
# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG DATABASE_URL="postgresql://user:password@localhost:5432/placeholder"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output and generated Prisma client from the build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./dist/generated
COPY --from=builder /app/prisma ./prisma

EXPOSE 5002

CMD ["npm", "start"]