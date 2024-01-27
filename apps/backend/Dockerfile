FROM node:20-bookworm-slim

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y curl

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1
ENTRYPOINT ["npm", "run", "start"]
