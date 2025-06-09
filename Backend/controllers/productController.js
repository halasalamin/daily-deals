import { v2 as cloudinary } from "cloudinary";
import mongoose from 'mongoose';
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      bestseller,
      discount,
      color,
      stockQty,
      brand
    } = req.body;

    // Handle image uploads if files are included
    const images = req.files ? Object.values(req.files).flat() : [];

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const foundCategory = await categoryModel.findById(category);
    if (!foundCategory) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    // Construct the product data
    const productData = {
      name,
      description,
      category: foundCategory._id,  // Use the category ID
      brand,
      price: Number(price).toFixed(2),
      bestseller: bestseller === "true",  // Convert bestseller to boolean
      discount: Math.min(100, Math.max(0, Number(discount || 0))),
      colors: Array.isArray(color) ? color : [color],  // Ensure color is an array
      quantity: Number(stockQty),
      images: imagesUrl,
      companyId: req.user.companyId,  // Assuming the company ID is set in the request
      date: Date.now(),
    };

    // Create and save the product
    const product = new productModel(productData);
    const savedProduct = await product.save();

    // Respond with the success message
    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product: savedProduct
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Function to list all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({}).populate('companyId', 'name photo');
    const total = products.length;

    res.json({
      success: true,
      data: {
        products: products.map(p => p.toObject()),
        total,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ success: false, message: "Please provide a search keyword." });
    }

    // Building the query
    const searchQuery = {
      $or: [
        { description: { $regex: new RegExp(q, 'i') } },
        { name: { $regex: new RegExp(q, 'i') } },
        { brand: { $regex: new RegExp(q, 'i') } }
      ]
    };

    // Optionally, you can add category search if `q` matches a category name (or ID)
    if (mongoose.Types.ObjectId.isValid(q)) {
      searchQuery.$or.push({ category: mongoose.Types.ObjectId(q) });
    }

    const products = await productModel.find(searchQuery);

    if (products.length === 0) {
      const allProducts = await productModel.find();
      return res.json({ success: true, products: allProducts });
    }

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Function to remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { status: "unavailable" },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product marked as unavailable",
      status: updatedProduct.status
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProductByAdmin = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = 'unavailable';
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product marked as unavailable successfully",
      data: product,
    });
  } catch (error) {
    console.error("Remove product error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};


// Function to get a single product details
const SingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product.toObject(), finalPrice: product.discountedPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Function to update a product
const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, price, category, colors, discount } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (price && isNaN(price)) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    if (discount !== undefined && isNaN(Number(discount))) {
      return res.status(400).json({ success: false, message: "Invalid discount value" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(Number(price).toFixed(2)) : product.price;
    product.category = category || product.category;

    if (Array.isArray(colors)) {
      product.colors = colors.filter(color => !!color);
    }

    if (discount !== undefined) {
      const safeDiscount = Math.min(100, Math.max(0, Number(discount)));
      product.discount = safeDiscount;
    }

    // Upload new images if provided
    const files = req.files || [];
    if (files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            folder: 'products', 
          });
          return uploadResult.secure_url;
        })
      );
      product.images = uploadedImages; 
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};



// Function to get products by company
const productsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const products = await productModel.find({ companyId });

    if (products.length === 0) {
      return res.status(200).json({ success: false, message: "No products found for this company" });
    }

    res.json({ success: true, data: products.map(product => product.toObject()) });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, category, brand } = req.query;

    const filter = {};
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (category) {
      const categories = await categoryModel.find({
        name: { $regex: new RegExp(category, 'i') }
      });

      if (categories.length > 0) {
        filter.category = { $in: categories.map(c => c._id) };
      }
    }

    if (brand) {
      filter.brand = { $regex: new RegExp(brand, 'i') };
    }

    const filteredProducts = await productModel.find(filter)
      .populate('category', 'name')
      .populate('companyId', 'name photo');

    const finalProducts = filteredProducts.map(p => ({
      ...p.toObject(),
      finalPrice: p.discountedPrice
    }));

    res.status(200).json({
      success: true,
      products: finalProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRelatedProducts = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const relatedProducts = await productModel.find({
      category: product.category,
      _id: { $ne: product._id }
    });

    res.json({ success: true, data: relatedProducts.map(p => p.toObject()) });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateMyProduct = async (req, res) => {
  const productId = req.params.id;
  const companyId = req.user.companyId;
  const updates = req.body;


  try {
    // Find the product owned by this company
    const product = await productModel.findOne({ _id: productId, companyId });

    if (!product) {
      return res.status(404).json({ message: "Product not found or not owned by your company" });
    }


    // Optionally fetch the updated product to return fresh data
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updates, {new: true});

    return res.status(200).json({ message: "Product updated successfully", data: updatedProduct.toObject() });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export { listProduct, addProduct, removeProduct, SingleProduct, updateProduct, productsByCompany, filterProducts, getRelatedProducts, updateMyProduct
  , removeProductByAdmin };
