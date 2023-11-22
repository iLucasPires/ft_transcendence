FROM node:20-bookworm-slim

WORKDIR /app

RUN apt update

COPY package.json .
COPY package-lock.json .

RUN npm install && npm install --global serve

COPY . .

RUN npm run build

EXPOSE 5173
CMD ["serve", "--no-clipboard", "--listen", "5173", "dist"]