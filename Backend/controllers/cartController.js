import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Add Products To User Cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, color } = req.body;
        const userId = req.user.id;


        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "The quantity must be a positive number"
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $set: { [`items.${productId}`]: { quantity, color } } },
            { upsert: true, new: true }
            );

        const items = [];        
        for (const [key, value] of cart?.items?.entries?.() ?? []) {
            items.push({ productId: key.toString(), quantity: value.quantity, color: value.color });
        }

        res.json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the product to the cart"
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            { $unset: { [`items.${req.params.productId}`]: "" } },
            { new: true } // Return the updated document
          );

        const items = [];        
        for (const [key, item] of cart?.items?.entries?.() ?? []) {
            items.push({ productId: key.toString(), quantity: item.quantity, color: item.color });
        }
        res.json({
            success: true,
            data: items,
        });

    } catch (error) {
        console.error("Error fetching basket data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching basket data"
        });
    }
};

// Clear cart

const clearCart = async (req, res) => {
    try {
        await Cart.updateOne(
            { userId: req.user.id },
            { $set: { items: {} } }
          );

        res.json({
            success: true,
            data: [],
        });

    } catch (error) {
        console.error("Error fetching basket data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching basket data"
        });
    }
};

// Get User Cart Data
const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        const items = [];        
        for (const [key, item] of cart?.items?.entries?.() ?? []) {
            items.push({ productId: key.toString(), quantity: item.quantity, color: item.color });
        }

        res.json({
            success: true,
            data: items,
        });

    } catch (error) {
        console.error("Error fetching basket data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching basket data"
        });
    }
};

// Get User Cart Data
const getUserCartProducts = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });

        const productIds = [];
        for (const [key, value] of cart?.items?.entries?.() ?? []) {
            productIds.push(key);
        }

        let products = [];
        if (productIds.length)
             products = await Product.find({_id: {$in: productIds}});

        res.json({
            success: true,
            data: products.map(product => product.toObject()),
        });

    } catch (error) {
        console.error("Error fetching basket data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching basket data"
        });
    }
};


export { addToCart, getUserCart, removeFromCart, clearCart, getUserCartProducts };