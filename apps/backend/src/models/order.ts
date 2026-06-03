import mongoose, { Schema, model } from "mongoose";
import { DB_COLLECTIONS } from "../constants/db-colletctions.js";
import { OrderStatus } from "../constants/order-status.js";
// export enum OrderStatus {
//   RECEIVED = "Order Received",
//   PREPARING = "Preparing",
//   OUT_FOR_DELIVERY = "Out For Delivery",
// }

const orderSchema = new Schema(
  {
    items: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: String,
        quantity: Number,
        unitPrice: Number,
        subtotal: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.RECEIVED,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model("Order", orderSchema, DB_COLLECTIONS.ORDERS);