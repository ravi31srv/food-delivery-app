import { Types } from "mongoose";

export interface OrderItem {
 menuItemId: Types.ObjectId;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface OrderRepoType {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface OrderResponseType {
  _id: Types.ObjectId;
  status: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}