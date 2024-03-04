import { io } from "socket.io-client";
import type { iChatException } from "./types/props";

export const socket = io({
  path: "/api/socket.io",
  withCredentials: true,
});

export const chatSocket = io("/chat", {
  path: "/api/socket.io",
  withCredentials: true,
});

export const gameSocket = io("/game", {
  path: "/api/socket.io",
  withCredentials: true,
});

chatSocket.on("exception", ({ message }: iChatException) => {
  const appStore = useAppStore();
  appStore.changeMessageLog(`Error: ${message}`);
});
