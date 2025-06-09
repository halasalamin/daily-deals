import express from 'express';
import { addToCart, getUserCart, removeFromCart, clearCart, getUserCartProducts } from '../controllers/cartController.js';
import { getProductFromBody } from '../middleware/product.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.get('/', authUser, getUserCart);
cartRouter.get('/products', authUser, getUserCartProducts);
cartRouter.post('/', authUser, getProductFromBody,addToCart);
cartRouter.delete('/:productId', authUser, removeFromCart);
cartRouter.delete('/', authUser, clearCart);

export default cartRouter;
