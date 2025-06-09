import Review from '../models/reviewModel.js';
import hasPurchased from "../middleware/hasPurchased.js";
import productModel from '../models/productModel.js';

const addReview = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    if (!rating && !comment) {
      return res.status(400).json({ message: "Please provide a rating or a comment." });
    }

    const purchased = await hasPurchased(userId, productId);
    if (!purchased) {
      return res.status(403).json({ message: "You can only review products you have purchased." });
    }

    let review = await Review.findOne({ userId, productId });

    if (review) {
      // Update existing review
      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = new Review({ userId, productId, rating, comment });
      await review.save();

      // Add review to product
      await productModel.findByIdAndUpdate(productId, {
        $push: { reviews: review._id },
      });
    }

    res.status(201).json({
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export { addReview, getAllReviews };
