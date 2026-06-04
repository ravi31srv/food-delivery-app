
import {Router} from 'express'
import {getMenuItems,addMenuItem }from '../controllers/menuItem.controller.js'
const menuItemRouter = Router()

// Define your menu items routes here
menuItemRouter.get('/', getMenuItems)
menuItemRouter.post('/', addMenuItem)

export default menuItemRouter;