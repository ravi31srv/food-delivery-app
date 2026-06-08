import { Response, Request } from 'express';
import * as orderService from '../services/order.service.js';
import { getIO } from '../socket.js';
import { isValidObjectId } from 'mongoose';
import { handleControllerError } from '../utils/errorHandler.js';

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
    const result = await orderService.getOrderById(id);
    res.json(result);
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const result = await orderService.getOrders(page, limit);
 
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
}

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.placeOrder(req.body);
    res.json(result);
  } catch (error) {

    console.error('Error placing order:', error);
    handleControllerError(error, res);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const result : any = await orderService.updateOrderStatus(id, { status });
    // Emit socket event to notify clients about the order status update
    try {
      const io = getIO();
      if (io) {
        io.to(id).emit('order-update', { id, status: result.data.status ?? status, data: result.data });
        console.log(`Emitted order-update for order ${id}`);
      }
    } catch (e) {
      console.error('Error emitting socket event for order update:', e);
    }
    res.json(result);

  } catch (error: any) {
    console.error('Error updating order status:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Invalid status')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating order status' });
  }
};
