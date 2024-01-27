FROM node:20-bookworm-slim

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y curl

COPY package.json .
COPY package-lock.json .
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm install

COPY . .

EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000/api/health || exit 1
ENTRYPOINT ["npm", "run", "deploy"]
