import {Response, Request} from 'express'

export const getOrdersController = (req: Request, res: Response) => {
    res.json({message: "Get orders"})
}   

export const addOrderController = (req: Request, res: Response) => {
    res.json({message: "Add order"})
}