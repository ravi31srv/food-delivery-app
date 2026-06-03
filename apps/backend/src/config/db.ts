import mongoose from "mongoose";
import { env } from "./env.js";
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.mongoUri;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};