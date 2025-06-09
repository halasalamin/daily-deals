import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  prediction: { type: Number, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
