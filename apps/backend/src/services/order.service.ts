
import * as orderRepo from '../repositories/orders.repository.js'
import * as menuItemsRepo from '../repositories/menuItems.repository.js'
import { CreateOrderDto } from '../dtos/order.dto.js';

export const getOrderById = async (id: string) => {
  // Implement logic to fetch a specific order from the database
  const result = await orderRepo.getOrderById(id);
  return { message: "Get order by ID service", data:result };
}

export const getOrders = async () => {
  // Implement logic to fetch all orders from the database
  const result = await orderRepo.getOrders();
  return { message: "Get all orders service", data:result };
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
            throw new Error(`Item ${item.itemId} not found`);
        }

        const subTotal = details.price * item.quantity;
        totalAmount += subTotal;

        return {
            menuItemId: item.itemId,
            unitPrice: details.price,
            quantity: item.quantity,
            subTotal
        };
    });

    // 4. Save the order once
    const result =   await orderRepo.placeOrder({
        ...orderData,
        items: processedItems,
        totalAmount
    });
    // const itemsOfOrder =await menuItemsRepo.getMenuItemByIds(orderData.items.map((item: any) => item.itemId));
    // const result = await orderRepo.placeOrder(orderData);
    // Implement logic to create a new order in the database
  return { message: "Place order service",data: result };
}

