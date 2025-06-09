import React, { useState } from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ButtonComponent from "../../widgets/ButtonComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = ({ token, items, selectedItems, clearAll }) => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleBuyNow = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        alert("Please log in to complete your purchase.");
        return;
      }

      const selectedCartItems = items.filter((item) =>
        selectedItems.includes(item.id)
      );

      if (selectedCartItems.length === 0) {
        alert("Please select at least one item to purchase.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/order/place`,
        { cart: selectedCartItems, address, phone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      clearAll();
      navigate("/orders");
    } catch (error) {
      alert("Checkout failed.");
      console.error(error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Payment Information
      </Typography>
      <form onSubmit={handleBuyNow}>
        <Box display="flex" alignItems="flex-end" mb={3}>
          <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Box>
        <Box display="flex" alignItems="flex-end" mb={3}>
          <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Box>
        <Box display="flex" alignItems="center" bgcolor="#FFF3CD" p={2} borderRadius={1} mb={3}>
          <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="body2">
            Cash on delivery is available. Delivery charges may apply.
          </Typography>
        </Box>
        <ButtonComponent
          text="Confirm Payment"
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
        />
      </form>
    </Paper>
  );
};

export default Payment;
