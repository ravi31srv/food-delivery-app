import {Router} from 'express'
import { getOrderById, placeOrder, getOrders, updateOrderStatus} from '../controllers/order.controller.js'
import { validateBody } from '../middleware/validate.js'
import { CreateOrderDto, OrderItemDto } from '../dtos/order.dto.js'

const orderRouter = Router()


// Define your orders routes here
orderRouter.get('/:id', getOrderById)
orderRouter.get('/', getOrders)
orderRouter.post('/',validateBody(
      CreateOrderDto),
      placeOrder)
orderRouter.patch('/:id', updateOrderStatus)

export default orderRouter;

