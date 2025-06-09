import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String, default: '' }
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

adsSchema.index({ endTime: 1 });

const adsModel = mongoose.model('Ads', adsSchema);
export default adsModel;
