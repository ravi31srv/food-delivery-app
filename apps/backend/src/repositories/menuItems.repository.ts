import { IMenuItem } from "../types/menuItems.types.js";
import { MenuItem } from "../models/menuItem.js";

export const getMenuItems = async ()  : Promise<IMenuItem[]> => {
 const menuItems: IMenuItem[] = await MenuItem.find({isAvailable:true}).lean();
 return menuItems;
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