import "reflect-metadata";

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { seedDatabase } from "../seeds/menuItemSeeder.js";

beforeAll(async () => {
  await connectDB();
  await seedDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
