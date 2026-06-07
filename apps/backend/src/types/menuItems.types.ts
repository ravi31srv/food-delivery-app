import { Types } from "mongoose";


export interface IMenuItem {
  _id: string | Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}