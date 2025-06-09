import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: {
        type: [
            {
                productId: String,
                name: String,
                price: Number,
                quantity: Number,
                color: String,
            }
        ],
        required: true
    },
    amount: { type: Number, required: true },
    address: {
        type: {
            fullName: String,
            phone: String,
            street: String,
            city: String,
            postalCode: String,
            country: String
        },
        required: true
    },
    referenceId: { type: String, required: true, unique: true, index: true },
    status: { type: String, required: true, default: 'Pending' },
    payment: { type: Boolean, required: true, default: false },
    paymentMethod: { type: String, required: true, default: "COD" },
    date: { type: Number, required: true }
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

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
