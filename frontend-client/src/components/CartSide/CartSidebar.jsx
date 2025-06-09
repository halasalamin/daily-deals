import React from "react";
import { Drawer, Typography, Button, Divider, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ open, onClose, products }) => {
  const calculatePrice = (product) => {
    if (product.discount) {
      return product.price - (product.price * product.discount) / 100;
    }
    return product.price;
  };

  const subtotal = products.reduce((acc, p) => acc + calculatePrice(p), 0);
  const navigate = useNavigate();

  return (
    <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{
        sx: {
          width: 450,
          height: "90%",
          overflow: 'hidden',
          mt: 6,
          mb: 8,
        //   borderTopLeftRadius: 12,
        //   borderBottomLeftRadius: 12,
          borderRadius: 2,
          boxShadow: 3,
          right: 40,
          position: 'fixed',
        },
        elevation: 4,
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <CheckCircleIcon sx={{color: "#167f81", marginRight: '8px', marginLeft: '12px'}} />
            <Typography variant="h6" style={{}}>Added to cart!</Typography>
          </div>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      <div style={{padding: '16px'}}>
        {products.map((product) => (
          <Box key={product.id} display="flex" mt={2}>
            <img src={product.images?.[0]} alt={product.title} width={64} height={64} style={{ marginRight: 12 }} />
            <Box>
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body2" color="textSecondary">{product.description}</Typography>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{marginTop: '40px'}}>
          Subtotal ({products.length} item{products.length > 1 ? 's' : ''}): <strong>₪{subtotal}</strong>
        </Typography>

        <Box mt={2}>
          <Button onClick={(e)=> {
            e.preventDefault();
            navigate('/cart-page')
          }} variant="contained" color="success" fullWidth sx={{ mb: 1, backgroundColor:"#167f81" }}>
            View Cart
          </Button>
          <Button variant="outlined" fullWidth onClick={(e) => {
            e.preventDefault();
            onClose()
          }}>
            Continue Shopping
          </Button>
        </Box>
      </div>
    </Drawer>
  );
};

export default CartSidebar;
