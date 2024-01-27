FROM node:20-bookworm-slim

WORKDIR /app

RUN apt update && apt install -y curl

COPY package.json .
COPY package-lock.json .

RUN npm install && npm install --global serve

COPY . .

EXPOSE 5173
HEALTHCHECK CMD curl --silent --fail http://localhost:5173 >/dev/null || exit 1
ENTRYPOINT ["scripts/entrypoint.sh"]
