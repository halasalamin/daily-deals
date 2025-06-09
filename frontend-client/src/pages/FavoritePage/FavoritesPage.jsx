import React, { useEffect, useState } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Rating from "@mui/material/Rating";
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { Link } from "react-router-dom";
import styles from './Favorites.module.css'
import ButtonComponent from "../../widgets/ButtonComponent";
import CartSidebar from "../../components/CartSide/CartSidebar";
import LoginPromptDialog from "../../components/LoginPromptDialog";

import { useCart } from "../../context/CartContext";

function FavoritesPage({product, user }) {
  const { add } = useCart();
  const { add: addFavorite, remove: removeFavorite, favorites, getUserFavoriteProducts, clearAll, isFavorite } = useFavorites();
  const [products, setProducts] = useState({});

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProducts, setSidebarProducts] = useState([]);
  const [showLoginPromptDialog, setShowLoginPrompotDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const productsArr = await getUserFavoriteProducts();
      const productsMap = {};
      productsArr.map(product => productsMap[product.id] = product);
      setProducts(productsMap);
    }

    fetchData();
  }, []);

  const maxWords = 10;
  const getShortDescription = (text) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };



  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!product || !product.id) {
    console.error("Invalid product:", product);
    return;
  }
    if (!user) {
      setShowLoginPrompotDialog(true);
      return;
    }
    await add({ productId: product.id, quantity: 1 });
    setSidebarProducts([product]);
    setSidebarOpen(true);
  };

  if (!user) {
    return (
      <div style={{margin: 'auto', marginTop: '100px'}}>
        <p className={styles.emptyCart}>Please log in to view your favorite items.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4" gutterBottom>
          Your Favorite Products
        </Typography>
        {favorites.length ?
          <Button
            variant="outlined"
            color="error"
            onClick={clearAll}
            sx={{ mb: 2 }}
          >
            Clear All
          </Button> : <></>
        }
      </div>

      {favorites.length === 0 ? (
        <Typography sx={{marginTop: '100px'}}>No favorite products yet.</Typography>
      ) : (
        <>
        <Grid container spacing={2}>
          {favorites.map((productId) => {
            const product = products[productId];
            if (!product) return null;

            const discountedPrice = product.discount > 0
              ? product.price - (product.price * product.discount) / 100
              : product.price;

            return (
                  <div className={styles["product-card"]}>
                    <Link to={`/product/${product.id}`} className="product-link">
                      <div className={styles["image-container"]}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className={styles["product-image"]}
                        />
                        <div className={styles["add-to-cart-button"]}>
                          <ButtonComponent
                            text="Add to Cart"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={styles["cart-btn"]}
                            icon={<AddShoppingCartIcon />}
                          />
                          <CartSidebar
                            open={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                            products={sidebarProducts}
                          />
                        </div>
                      </div>
                    </Link>
                  <div className={styles["details-container"]}>
                  <p className={styles["product-description"]}>
                  {product.description}
                  </p>

                  <Rating
                  name={`rating-${product.id}`}
                  value={product.rating || 0}
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
{/*
                  <div className={styles["favorite-icon"]}>
                    <IconButton onClick={() => remove(product.id)} color="error">
                      <DeleteOutlineOutlinedIcon/>
                    </IconButton>
                  </div> */}

<div className={styles["favorite-icon"]}>
            {isFavorite(product.id) ? (
              <FavoriteIcon
                onClick={() => removeFavorite(product.id)}
                style={{ color: "red", cursor: "pointer" }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => addFavorite(product.id)}
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
          )})}
        </Grid>
        </>
      )}
    {showLoginPromptDialog && <LoginPromptDialog onClose={() => setShowLoginPrompotDialog(false)}/>}
    </>
  );
}

export default FavoritesPage;
