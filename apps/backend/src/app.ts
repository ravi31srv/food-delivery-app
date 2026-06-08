import "reflect-metadata";

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import menuItemRouter from './routes/menuItem.routes.js'
import orderRouter from './routes/order.routes.js'
import { seedDatabase } from "./seeds/menuItemSeeder.js";
import http from "http";
import { initializeSocket } from "./socket.js";

export const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/menu-items", menuItemRouter);
app.use("/orders", orderRouter);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Only connect DB and start server — does NOT call listen here
export const startServer = async (port: number = 4000) => {
  await connectDB();
  await seedDatabase();

  const server = http.createServer(app);
 
console.log("Server created, initializing Socket.IO...");
  initializeSocket(server);
  console.log("Socket.IO initialized, starting server...");

  return new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
      resolve();
    });
  });
};



