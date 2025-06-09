
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Rating, Typography, IconButton } from "@mui/material";
import ButtonComponent from "../../widgets/ButtonComponent";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import styles from './ProductDetails.module.css';
import axios from "axios";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, CardMedia, Grid } from "@mui/material";
import { useFavorites } from "../../context/FavoritesContext";
import CartSidebar from "../../components/CartSide/CartSidebar";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from "../../context/CartContext";
import ColorPicker from "../../widgets/ColorPicker";
import {Snackbar, Alert} from "@mui/material";
import ReviewSection from "../../components/ReviewPart/ReviewSection";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import {
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';

const ProductDetail = ({ products, user }) => {
  const {add} = useCart();
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLoginPromptDialog, setShowLoginPrompotDialog] = useState(false);



  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProducts, setSidebarProducts] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  const { add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites();

  const discountedPrice = (product?.price ?? 0) * (1 - (product?.discount ?? 0) / 100);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'error', 'warning', 'info'
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };


  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      const response = await axios.get(`http://localhost:4000/api/product/single/${productId}`);
      setProduct(response.data.data)
      setLoading(false);
    }

    fetchData();
  }, [productId])


  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginPrompotDialog(true);
      return;
    }

  if (!selectedColor) {
    showSnackbar("Please select a color before adding to cart.", "warning");
    return;
  }

  await add({ productId: product.id, quantity, color: selectedColor });
  setSidebarProducts([product]);
  setSidebarOpen(true);
};

    const handleQuantityInput = (e) => {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value > 0) {
        setQuantity(value);
      } else {
        setQuantity(1);
      }
    };


    useEffect(() =>{
      const fetchData = async () => {
        try{
        const related = await axios.get(`http://localhost:4000/api/product/related/${productId}`);
        setRelatedProducts(related.data.data);
        setLoading(false);
        } catch (err) {
          console.error("Error fetching product or related:", err);
        }
      };
      fetchData();
  }, [productId])


const handleRatingChange = (newRating) => {
  setAverageRating(newRating);
};

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <h2>Product not found!</h2>;

  const deliveryInfo = () => {
    const deliveryDate = getDeliveryDate();

    return <p>Delivery on {formatDate(deliveryDate)}</p>;
  };

  return (
    <div>
        <div className={styles.productDetailsContainer}>
          <Box display="flex" className={styles.mainContent}>
          <div className={styles.imageSideHolder}>
            <ImageSlider images={product.images} />
            {product.company && (
            <Box display="flex" alignItems="center" mt={2} ml={2} gap={2}>
              <img
                src={product.company.image}
                alt={product.company.username}
                style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {product.company.username}
              </Typography>
            </Box>
          )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:'space-between',
              marginTop: '16px'
            }}>
              <ColorPicker
                 colors={product.colors}
                 selectedColor={selectedColor}
                 onSelect={(color) => setSelectedColor(color)}
              />
              <IconButton>
                {isFavorite(product.id) ?
                  <FavoriteIcon
                    className={styles.favIcon}
                    onClick={() => removeFavorite(product.id)}
                    style={{color: 'red', fontSize: 32}}
                  /> :
                  <FavoriteBorderIcon
                    onClick={() => {
                      if (!user) {
                        setShowLoginPrompotDialog(true);
                        return;
                      }
                      addFavorite(product.id)
                    }}
                    style={{color: 'black', fontSize: 32}}
                  />
                }
              </IconButton>
            </div>
              <div style={{ display: 'flex', marginTop: "20px", alignItems: 'center' }}>
                {Number.isFinite(averageRating) ? (
                  <div style={{ display: 'flex', marginTop: "20px", alignItems: 'center' }}>
                    <Typography sx={{ whiteSpace: 'nowrap', marginRight: '6px'}}>
                      {averageRating.toFixed(1)}
                    </Typography>
                    <Rating value={averageRating} readOnly size="larg" precision={0.1} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', marginTop: "20px", alignItems: 'center' }}>
                    <Typography sx={{ whiteSpace: 'nowrap', marginRight: '6px'}}>No Available Ratings Yet</Typography>
                    <Rating value={0} readOnly size="small" />
                  </div>
                )}
              </div>
            </div>

            <Box width="2px" mx={3} sx={{borderRight: 'solid 2px #e1e2ea'}} />

            <Box flex="1" className={styles.detailsSection}>
              <Typography variant="h4">{product.name} / {product.brand}</Typography>
              <Typography mt={2}>{product.description}</Typography>
            </Box>
          </Box>
          <div className={styles.rightSideContainer}>
            <div style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'flex-start' }}>
              {product.discount ? (
                <>
                  <Typography variant="h6" style={{ color: "#167f81", fontSize: "25px", fontWeight: "600" }}>
                    <span style={{ color: "#CC0C39", fontSize: 20, marginRight: 10, fontWeight: 500 }}>
                    -{product.discount}%
                    </span>
                    {discountedPrice.toFixed(2)}
                    <span style={{fontWeight: 500, marginLeft: '3px'}}>₪</span>
                  </Typography>
                  <Typography variant="h6" style={{ color: "gray", textDecoration: "line-through" }}>
                    {product.price} ₪
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" style={{ color: "#167f81", fontSize: "25px", fontWeight: "600" }}>
                  {product.price}
                  <span style={{fontWeight: 500, marginLeft: '3px'}}>₪</span>
                </Typography>
              )}
              <br />
              {deliveryInfo()}
              <Typography sx={{ color: 'teal', fontWeight: 500, mb: 0.5, marginTop: '20px' }}>
                {product.quantity ? "Available" : "Sold Out"}
              </Typography>

              <FormControl
                sx={{
                  backgroundColor: '#f3f4f4',
                  height: '38px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '4px',
                  border:' 1px solid #167f81',
                  padding: 0,
                  width: '220px',
                  display: 'flex',
                  flexFlow: 'row nowrap',
                }}
                size="small"
              >
                <Select
                  value={quantity}
                  onChange={handleQuantityInput}
                  displayEmpty
                  variant="standard"
                  disableUnderline
                  renderValue={(selected) => `Quantity:    ${selected}`}
                  sx={{
                    fontWeight: 500,
                    width: '100% !important',
                    px: 1,
                    '& .MuiSelect-select': {
                      padding: 0, // input
                      textAlign: 'left',
                    },
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <ButtonComponent
                text="Add to Cart"
                onClick={handleAddToCart}
                className={styles["cart-btn"]}
                icon={<AddShoppingCartIcon />}
                sx={{ width: '220px !important' }}
                disabled={product.status === "unavailable"}
              />
            </div>
          </div>
        </div>

        <CartSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          products={sidebarProducts}
        />
        {/* related products list*/}
        <Box className={styles.relatedProductsContainer} mt={5} px={4}>
          <Grid container spacing={2}>
          {relatedProducts.map((related) => (
            <Grid item xs={12} sm={6} md={3} key={related.id} sx={{ width: '200px' }}>
              <Card onClick={() => navigate(`/product/${related.id}`)} sx={{ cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={related.images?.[0]}
                  alt={related.name}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {related.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {related.brand}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {related.discount
                      ? `${(related.price * (1 - related.discount / 100)).toFixed(2)} ₪`
                      : `${related.price.toFixed(2)} ₪`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
        {/* Review Section: moved below product details */}
        {product && <ReviewSection productId={product.id} user={user} onAverageRating={setAverageRating} onAverageRatingChange={handleRatingChange}/>}
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {showLoginPromptDialog && <LoginPromptDialog onClose={() => setShowLoginPrompotDialog(false)}/>}
    </div>
  );
};

const getDeliveryDate = () => {
  const today = new Date();
  let deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 2); // Default: 3 days from now

  // If delivery date falls on Friday (getDay() === 5), skip it
  if (deliveryDate.getDay() === 5) {
    deliveryDate.setDate(deliveryDate.getDate() + 1); // Move to Saturday
  }

  return deliveryDate;
};

const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export default ProductDetail;
