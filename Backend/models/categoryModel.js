import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
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

export default mongoose.model('Category', categorySchema);
