import { io } from "socket.io-client";

export const socket = io({
  autoConnect: false,
  path: "/api/socket.io",
  withCredentials: true,
});
