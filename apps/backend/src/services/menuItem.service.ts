import { Request, Response } from 'express';
import * as menuItemsRepo from '../repositories/menuItems.repository.js'
import { ApiResponse } from '../types/common.types.js';
import { IMenuItem } from '../types/menuItems.types.js';

export const addMenuItem = async (req: Request, res: Response)  : Promise<ApiResponse<IMenuItem>> => {
  // Logic to add a new menu item to the database
  const menuItem = await menuItemsRepo.addMenuItem(req.body);
  return { message: "Menu item added", data: menuItem };
};

export const getMenuItems = async ({ page, limit }: { page: number; limit: number; }) => {
  const [menuItems, total] = await Promise.all([
    menuItemsRepo.getMenuItems(page, limit),
    menuItemsRepo.countMenuItems(),
  ]);

  return {
    message: "Get menu items",
    data: menuItems,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}