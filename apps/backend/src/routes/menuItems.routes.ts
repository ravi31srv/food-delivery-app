
import {Router} from 'express'
import {addMenuItemController,getMenuItemController } from '../controllers/menuItems.controller.js'
const menuItemRouter = Router()

// Define your menu items routes here
menuItemRouter.get('/', getMenuItemController)
menuItemRouter.post('/', addMenuItemController)

export default menuItemRouter;