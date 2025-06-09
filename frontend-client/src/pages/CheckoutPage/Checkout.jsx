import React, { useState, useEffect } from 'react';
import styles from "./Checkout.module.css";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import backgroundImage from "../../assets/appLogo.png";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

const ShippingForm = ({ formData, setFormData, errors, setErrors, onDeliveryCashChange }) => {
  useEffect(() => {
    let deliveryCash = 20;
    if (formData.state === 'Jerusalem') deliveryCash = 30;
    else if (formData.state === 'Occupied territories') deliveryCash = 70;
    else if (formData.state === 'H' || formData.state === 'R') deliveryCash = 20;
    else if (formData.state === '') deliveryCash = 0;
    onDeliveryCashChange(deliveryCash);
  }, [formData.state, onDeliveryCashChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <form className={styles.formSection}>
      <h2>Shipping information</h2>
      <p>Add a new shipping address</p>

      <TextField
        name="fullName"
        label="Full Name *"
        value={formData.fullName}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.fullName}
        helperText={errors.fullName}
        margin="normal"
      />

      <TextField
        name="address1"
        label="Address Line 1 *"
        value={formData.address1}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.address1}
        helperText={errors.address1}
        margin="normal"
      />

      <TextField
        name="address2"
        label="Address Line 2"
        value={formData.address2}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.state}>
        <InputLabel>City *</InputLabel>
        <Select
          name="state"
          value={formData.state}
          onChange={handleChange}
          label="City *"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Jerusalem">Jerusalem</MenuItem>
          <MenuItem value="Occupied territories">Occupied territories</MenuItem>
          <MenuItem value="Bethlehem">Bethlehem</MenuItem>
          <MenuItem value="Hebron">Hebron</MenuItem>
          <MenuItem value="Ramallah">Ramallah</MenuItem>
          <MenuItem value="Nablus">Nablus</MenuItem>
          <MenuItem value="Jericho">Jericho</MenuItem>
          <MenuItem value="Tulkarm">Tulkarm</MenuItem>
        </Select>
        {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
      </FormControl>

      <TextField
        name="phone"
        label="Mobile Number *"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.phone}
        helperText={errors.phone}
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            name="defaultAddress"
            checked={formData.defaultAddress}
            onChange={handleChange}
          />
        }
        label="Set as my default shipping address"
        className={styles.checkboxContainer}
      />
    </form>
  );
};

const OrderSummary = ({ selectedItems, deliveryCash, totalProductsPrice, handleSubmit }) => {
  const finalTotal = totalProductsPrice + deliveryCash;

  return (
    <div className={styles.orderSummary}>
      <h2>Order summary</h2>
      <p>Items total: <strong>{selectedItems?.reduce((sum, item) => sum + item.quantity, 0)}</strong></p>
      <p><strong>Subtotal:</strong> ₪{totalProductsPrice.toFixed(2)}</p>
      <p><strong>Shipping:</strong> ₪{deliveryCash}</p>
      <h3><strong>Total:</strong> ₪{finalTotal.toFixed(2)}</h3>
      <Button
        onClick={handleSubmit}
        variant="contained"
        sx={{ backgroundColor: '#167f81', fontWeight:"bolder" }}
      >
        Place Order
      </Button>
      <p style={{marginTop:"80px"}}>
        By placing your order, you agree to Daily Deal's Terms of Use, Refund Policy and Privacy Policy.
      </p>
    </div>
  );
};

const ShippingCheckoutPage = ({ token }) => {
  const { remove } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItems = location?.state?.selectedItems || [];
  
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    phone: '',
    defaultAddress: false,
  });

  const [errors, setErrors] = useState({});
  const [deliveryCash, setDeliveryCash] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.address1) newErrors.address1 = "Address Line 1 is required";
    if (!formData.state) newErrors.state = "City is required";
    if (!formData.phone) newErrors.phone = "Mobile Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalProductsPrice = selectedItems.reduce((sum, item) => {
    const price = parseFloat(item.price || 0);
    const discount = parseFloat(item.discount || 0);
    const quantity = item.quantity || 1;
    return sum + price * (1 - discount / 100) * quantity;
  }, 0);

const handleSubmit = async () => {
  if (!validate()) {
    showSnackbar("Please fix validation errors.", "error");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:4000/api/order/place`,
      {
        cart: selectedItems,
        shippingInfo: formData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data.success) {
      showSnackbar("Order placed successfully!", "success");

      selectedItems.forEach(item => remove(item.id));

      navigate("/");
    } else {
      // If backend returns 200 but success is false (unlikely here)
      showSnackbar("Checkout failed. Please try again.", "error");
    }
  } catch (error) {
    console.log("Checkout failed:", error);
    showSnackbar("Checkout failed. Please try again.", "error");
    navigate("/checkout", { replace: true });
  }
};


  return (
    <>
    <AppBar position="static" sx={{ backgroundColor: '#167f81', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', flexDirection:"row", justifyContent: 'space-between' }}>
      <div sx={{ height: '50px' }}>
        <img
          src={backgroundImage}
          alt="logo"
          style={{ height:"100px", width: '120px', objectFit: 'contain', marginTop: '-15px', marginBottom:"-28px" }}
        />
      </div>
      <Typography
          variant="h6"
          sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'white',
        }}
        >
          <LockOpenOutlinedIcon sx={{ marginRight: '8px' }} /> Checkout
        </Typography>
      <Button
      variant="text"
      onClick={() => navigate('/cart-page')}
      startIcon={<ShoppingCartOutlinedIcon />}
      sx={{
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily:"sans-serif",
      marginRight:"25px",
      '&:hover': {
      backgroundColor: 'transparent',
      },
      }}
      >
      Return to Cart
      </Button>
      </Toolbar>
    </AppBar>
    <div className={styles.container}>
      <ShippingForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onDeliveryCashChange={setDeliveryCash}
      />
      <OrderSummary
        selectedItems={selectedItems}
        deliveryCash={deliveryCash}
        totalProductsPrice={totalProductsPrice}
        handleSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  </>
  );
};

export default ShippingCheckoutPage;
