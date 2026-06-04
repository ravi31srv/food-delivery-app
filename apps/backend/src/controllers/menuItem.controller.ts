import { Request, Response } from 'express';
import * as menuItemServices from '../services/menuItem.service.js';

export const getMenuItems = async (req: Request, res: Response) => {
  // Logic to fetch menu items from the database
  try {
    const result = await menuItemServices.getMenuItems(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

export const addMenuItem = async (req: Request, res: Response) => {
  try {
    const result = await menuItemServices.addMenuItem(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item' });
  }
};
