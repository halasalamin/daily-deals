import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";


const hasPurchased = async (userId, productId) => {
  const order = await orderModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    "items.productId": new mongoose.Types.ObjectId(productId),
    status: "Ready",
  });

  console.log("Order found:", order);
  return !!order;
};

export default hasPurchased;
