import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: String,
  price: {
    type: Number,
    required: true,
    set: (v) => Number(Number(v).toFixed(2)),
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quantity: Number,
  colors: [String],
  images: [String],
  bestseller: Boolean,
  companyId: mongoose.Schema.Types.ObjectId,
  date: Date
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

productSchema.virtual('finalPrice').get(function() {
  const discounted = this.price * (1 - (this.discount / 100));
  return parseFloat(discounted.toFixed(2)); 
});

export default mongoose.model('Product', productSchema);
