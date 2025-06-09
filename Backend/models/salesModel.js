import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  brand: { type: String, required: true },
  discount: { type: Number, min: 0, max: 1 },
  price: {type:Number},
  quantity_sold:{type:Number},
  month:{type:Number},
  year: {type:Number},
 
  
});


const Sales = mongoose.model("Sale", saleSchema);
export default Sales;