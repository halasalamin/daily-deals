import productModel from "../models/productModel.js";

const getProductFromBody = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    req.product = product;
    next();
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


export {
    getProductFromBody
}