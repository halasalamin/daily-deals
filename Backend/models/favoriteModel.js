import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, },
    productIds: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Product',
      },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},
{
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
  }
);

const favoriteModel = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

export default favoriteModel;
