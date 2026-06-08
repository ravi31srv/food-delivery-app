
import * as orderRepo from '../repositories/orders.repository.js'
import * as menuItemsRepo from '../repositories/menuItems.repository.js'
import { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/order.dto.js';
import { OrderStatus } from '../constants/order-status.js';
import { OrderRepoType } from '../types/order.types.js';
import { Types } from 'mongoose';

export const getOrderById = async (id: string) => {
  const result = await orderRepo.getOrderById(id);
  return { message: "Get order by ID service", data:result };
}

export const getOrders = async (page: number, limit: number) => {
  const [orders, total] = await Promise.all([
    orderRepo.getOrders(page, limit),
    orderRepo.countOrders(),
  ]);

  return {
    message: "Get all orders service",
    data: orders,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export const placeOrder = async (orderData: CreateOrderDto) => {

// 1. Extract all IDs from the orderData
    const itemIds = orderData.items.map(item => item.itemId);

    // 2. ONE query to fetch all matching items from the DB
    const itemsFromDb = await menuItemsRepo.getMenuItemByIds(itemIds);

    

    // 3. Create a Map for O(1) lookup speed
    const itemMap = new Map(itemsFromDb.map(i => [i._id.toString(), i]));

    let totalAmount = 0;
    const processedItems = orderData.items.map(item => {
        const details = itemMap.get(item.itemId);
        
        if (!details) {
            throw ({message: `Item ${item.itemId} not found`, statusCode: 400});
        }

        const subTotal = details.price * item.quantity;
        totalAmount += subTotal;

        return {
            menuItemId: new Types.ObjectId(item.itemId),
            unitPrice: details.price,
            quantity: item.quantity,
            subTotal
        };
    });

    // 4. Save the order once
    const result=   await orderRepo.placeOrder({
        ...orderData,
        items: processedItems,
        totalAmount
    });

  return { message: "Place order service",data: result };
}

export const updateOrderStatus = async (id: string, statusDto: UpdateOrderStatusDto) => {
  // Validate if status is a valid enum value
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(statusDto.status as any)) {
    throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
  }

  // Fetch the order to check if it exists
  const order = await orderRepo.getOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  // Update the order status
  const result = await orderRepo.updateOrderStatus(id, statusDto.status);
  return { message: "Order status updated successfully", data: result };
}

