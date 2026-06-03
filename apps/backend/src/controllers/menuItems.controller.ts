import { Request, Response } from 'express';


export const getMenuItemController = (req: Request, res: Response) => {
  // Logic to fetch menu items from the database
  res.json({ message: "Get menu items" });
}

export const addMenuItemController = (req: Request, res: Response) => { 
    res.json({ message: "Add menu item" });
}