import express from 'express';
import authUser from '../middleware/auth.js';
import { addReview, getAllReviews } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post("/:productId", authUser, addReview);
reviewRouter.get('/:productId', getAllReviews);


export default reviewRouter;
