import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
}, {
  toObject: {
    transform(doc, ret) {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  minimize: false,
  timestamps: true,
});

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default reviewModel;

