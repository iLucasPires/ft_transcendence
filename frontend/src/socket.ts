import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const socket = io(backendUrl, {
  withCredentials: true,
  autoConnect: false,
});
