import express from 'express';
import { addToFavorite, getUserFavorite, removeFromFavorite, clearFavorite, getUserFavoriteProducts } from '../controllers/favoriteController.js';
import authUser from '../middleware/auth.js';

const favoriteRouter = express.Router();

favoriteRouter.get('/', authUser, getUserFavorite);
favoriteRouter.get('/products', authUser, getUserFavoriteProducts);
favoriteRouter.post('/', authUser, addToFavorite);
favoriteRouter.delete('/:productId', authUser, removeFromFavorite);
favoriteRouter.delete('/', authUser, clearFavorite);

export default favoriteRouter;
