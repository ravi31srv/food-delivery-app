import mongoose, { Schema, model } from "mongoose";
import { DB_COLLECTIONS } from "../constants/db-colletctions.js";
// import { IMenuItem } from "./menu.model.types";

const menuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export const MenuItem = model("MenuItem", menuItemSchema, DB_COLLECTIONS.MENU_ITEMS);