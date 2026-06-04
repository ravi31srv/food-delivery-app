import { Response, Request } from 'express';
import * as orderService from '../services/order.service.js';
import { isValidObjectId } from 'mongoose';

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  // Type Guard
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
    const result = await orderService.getOrderById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getOrders();    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
}

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.placeOrder(req.body);
    res.json(result);
    //  res.json({ message: 'Order placed successfully',data: result });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};
