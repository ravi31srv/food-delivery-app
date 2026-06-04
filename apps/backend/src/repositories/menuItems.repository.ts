import { MenuItem } from "../models/menuItem.js";

export const getMenuItems = async () => {
  // Implement logic to fetch menu items from the database
 const menuItems = await MenuItem.find({isAvailable:true});
 return menuItems;
}

export const getMenuItemByIds = async (ids: string[]) => {
  // Implement logic to fetch specific menu items from the database
  const menuItems = await MenuItem.find({ _id: { $in: ids } });
  return menuItems;
}

export const addMenuItem = async (menuItemData: any) => {
  // Implement logic to add a new menu item to the database
  const newMenuItem = new MenuItem(menuItemData); 
  await newMenuItem.save();
  return newMenuItem;
}