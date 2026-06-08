import { Request, Response } from 'express';
import * as menuItemServices from '../services/menuItem.service.js';

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const result = await menuItemServices.getMenuItems({ page, limit });
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
