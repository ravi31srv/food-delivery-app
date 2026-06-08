import { IMenuItem } from "../types/menuItems.types.js";
import { MenuItem } from "../models/menuItem.js";

export const getMenuItems = async (page: number, limit: number)  : Promise<IMenuItem[]> => {
  const filter = { isAvailable: true };
  const menuItems: IMenuItem[] = await MenuItem.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return menuItems;
}

export const countMenuItems = async () => {
  return MenuItem.countDocuments({ isAvailable: true });
}

export const getMenuItemByIds = async (ids: string[]): Promise<IMenuItem[]> => {
  const menuItems : IMenuItem[] = await MenuItem.find({ _id: { $in: ids } }).select("_id name price description imageUrl isAvailable createdAt updatedAt").lean();
  return menuItems;
}

export const addMenuItem = async (menuItemData: any) => {
  const newMenuItem= new MenuItem(menuItemData); 
  await newMenuItem.save();

  return newMenuItem;
}