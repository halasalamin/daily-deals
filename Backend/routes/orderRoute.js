import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus, getCompanyOrders, setOrderReady } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import companyAuth from "../middleware/companyAuth.js"

const orderRouter = express.Router();

orderRouter.get('/list', adminAuth, allOrders);
orderRouter.put('/:orderId/status', adminAuth, updateStatus);
orderRouter.post('/place', authUser, placeOrder);
orderRouter.get('/userorders', authUser, userOrders);
orderRouter.get('/companyorders', companyAuth, getCompanyOrders);
orderRouter.post('/set-ready', companyAuth, setOrderReady);

// orderRouter.get('/userorders', authUser, userOrdersByToken);

export default orderRouter;
