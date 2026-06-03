import {Router} from 'express'
import {addOrderController, getOrdersController} from '../controllers/orders.controller.js'
const orderRouter = Router()

// Define your orders routes here
orderRouter.get('/', getOrdersController)
orderRouter.post('/', addOrderController)

export default orderRouter;