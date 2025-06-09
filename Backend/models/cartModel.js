import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: {
      type: Map,
      of: new mongoose.Schema({
        quantity: { type: Number, required: true },
        color: { type: String }
      }, { _id: false })
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},{
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

const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default cartModel;
