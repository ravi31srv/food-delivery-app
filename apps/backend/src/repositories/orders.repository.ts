import { Order } from "../models/order.js";

export const getOrderById = async (id: string) => {
  // Implement logic to fetch a specific order from the database
 const order = await Order.findById(id);
 return order;
}

export const getOrders = async () => {
  // Implement logic to fetch all orders from the database
  const orders = await Order.find().select('_id customerName items totalAmount status').sort({ createdAt: -1 });
  return orders;
}

export const placeOrder = async (orderData: any) => {
  // Implement logic to create a new order in the database
  const newOrder = new Order(orderData);
  await newOrder.save();
  return newOrder;
}

export const updateOrderStatus = async (id: string, status: string) => {
  // Update order status in the database
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  return updatedOrder;
}