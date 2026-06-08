import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;
  
  socket = io(API_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const joinOrderRoom = (orderId: string) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("join-order", orderId);
    console.log("Joined order room:", orderId);
  }
};

export const onOrderUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on("order-update", callback);
  }
};

export const offOrderUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.off("order-update", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
