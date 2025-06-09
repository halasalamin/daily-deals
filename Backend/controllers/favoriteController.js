import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";

const MAX_QUANTITY = 10;

const addToFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        const favorite = await Favorite.findOneAndUpdate(
            { userId: req.user.id },
            { $addToSet: { productIds: productId } },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            data: favorite.toObject().productIds
        });

    } catch (error) {
        console.error("Error adding product to favorite:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the product to the favorite list"
        });
    }
};


const removeFromFavorite = async (req, res) => {
    try {
      const favorite = await Favorite.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { productIds: req.params.productId } },
        { new: true }
      )


      res.json({
        success: true,
        data: favorite.toObject().productIds
      });
    } catch (error) {
      console.error("Error fetching favorite list:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching favorite list"
      });
    }
  };


const clearFavorite = async (req, res) => {
    try {
        await Favorite.updateOne(
            { userId: req.user.id },
            { $set: { productIds: [] } }
          );

        res.json({
            success: true,
            data: [],
        });

    } catch (error) {
        console.error("Error fetching favorite list:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching favorite list"
        });
    }
};

const getUserFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ userId: req.user.id });
        const data = !favorite ? [] : favorite.toObject().productIds
        res.json({
            success: true,
            data,
        });

    } catch (error) {
        console.error("Error fetching basket data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching basket data"
        });
    }
};

const getUserFavoriteProducts = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ userId: req.user.id });

        let products = [];
        const productIds = !favorite ?  [] : favorite.toObject().productIds
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


export { addToFavorite, getUserFavorite, removeFromFavorite, clearFavorite, getUserFavoriteProducts };
