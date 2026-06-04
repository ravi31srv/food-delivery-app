// src/types/order.types.ts
import { Types } from 'mongoose';

export interface IOrderItem {
  itemId: string | Types.ObjectId;
  quantity: number;
  unitPrice?: number; // Optional until calculated in service
  subTotal?: number;  // Optional until calculated in service
}

export interface IOrderCreatePayload {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: IOrderItem[];
}