import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-order", (orderId) => {
      socket.join(orderId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export const getIO = () => io;