import mongoose from "mongoose";

// const companySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String },
//     logo: { type: String },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

// const companyModel = mongoose.models.Company || mongoose.model("Company", companySchema);


const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    adAccess: { type: Boolean, default: false },
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

export default mongoose.model('Company', companySchema);

// export default companyModel;