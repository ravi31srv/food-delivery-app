import { CreateOrderDto } from "../dtos/order.dto.js";
import { Order } from "../models/order.js";
import { OrderRepoType, OrderResponseType } from "../types/order.types.js";

export const getOrderById = async (id: string) => {
 const order = await Order.findById(id).populate('items.menuItemId', 'name price imageUrl').lean();
 return order;
}

export const getOrders = async () => {
  const orders = await Order.find().select('_id status customerName customerAddress customerPhone items totalAmount status').populate('items.menuItemId', 'name price imageUrl').sort({ createdAt: -1 }).lean();
  return orders;
}

export const placeOrder = async (orderData: OrderRepoType 
) => {
  const newOrder = new Order(orderData);
  await newOrder.save();
  return newOrder;
}

export const updateOrderStatus = async (id: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  return updatedOrder;
}