import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import ButtonComponent from "../../widgets/ButtonComponent";
import { useCart } from "../../context/CartContext";
import { Snackbar, Alert } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Rating from "@mui/material/Rating";
import CartSidebar from "../CartSide/CartSidebar";
import { useFavorites } from "../../context/FavoritesContext";
import LoginPromptDialog from '../LoginPromptDialog';
import axios from "axios";

const ProductCard = ({ product, user }) => {
  const { add } = useCart();
  const { add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProducts, setSidebarProducts] = useState([]);
  const [showLoginPromptDialog, setShowLoginPrompotDialog] = useState(false);
  const [averageRating, setAverageRating] = useState(0)

  const maxWords = 10;
  const getShortDescription = (text) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const discountedPrice = product.price - (product.price * product.discount) / 100;
  const productId = product.id;

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/reviews/${productId}`);
      const reviews = response.data.data;

      // Calculate average rating
      const ratings = reviews
        .map((r) => r.rating)
        .filter((r) => r !== undefined && r !== null);

      if (ratings.length > 0) {
        const avg = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
        setAverageRating(avg);

      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [productId]);



  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompotDialog(true);
      return;
    }
    await add({ productId: product.id, quantity });
    setSidebarProducts([product]);
    setSidebarOpen(true);
  };

  return (
    <>
    <div className={styles["product-card"]}>
      <Link to={`/product/${product.id}`} className="product-link">
        <div className={styles["image-container"]}>
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles["product-image"]}
          />
          {product.status !== "unavailable" && (
            <div className={styles["add-to-cart-button"]}>
              <ButtonComponent
                text="Add to Cart"
                onClick={handleAddToCart}
                className={styles["cart-btn"]}
                icon={<AddShoppingCartIcon />}
              />
              <CartSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                products={sidebarProducts}
              />
            </div>
          )}
        </div>
      </Link>

      <div className={styles["details-container"]}>
        <p className={styles["product-description"]}>
          {product.description}
        </p>

        <Rating
          name={`rating-${product.id}`}
          value={averageRating || 0}
          precision={0.5}
          readOnly
          size="medium"
        />

        <div className={styles["price-fav-container"]}>
          <div className={styles["price-details"]}>
            {product.discount > 0 ? (
              <>
                <p className={styles["product-discounted-price"]}>
                  <strong>{discountedPrice.toFixed(2)} ₪</strong>
                </p>
                <p className={styles["product-original-price"]}>
                  <s>{product.price.toFixed(2)} ₪</s>
                </p>
                <span className={styles["product-discount-label"]}>-{product.discount}%</span>
              </>
            ) : (
              <p className={styles["product-discounted-price"]}>
                <strong>{product.price.toFixed(2)} ₪</strong>
              </p>
            )}
          </div>

          <div className={styles["favorite-icon"]}>
            {isFavorite(product.id) ? (
              <FavoriteIcon
                onClick={() => removeFavorite(product.id)}
                style={{ color: "red", cursor: "pointer" }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => {
                  if(!user) {
                    setShowLoginPrompotDialog(true);
                    return;
                  }
                  addFavorite(product.id)
                }}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
    {showLoginPromptDialog && <LoginPromptDialog onClose={() => setShowLoginPrompotDialog(false)}/>}
    </>
  );
};

export default ProductCard;
