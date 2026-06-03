import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import menuItemRouter from './routes/menuItems.routes.js'
import orderRouter from './routes/orders.routes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/menu-items", menuItemRouter);
app.use("/orders", orderRouter);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

const PORT = env.port;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();