import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  ListItemAvatar,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/order/userorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const orderYears = Array.from(
    new Set(orders.map((order) => new Date(order.date).getFullYear()))
  );

  const filteredOrders =
    selectedYear === "All"
      ? orders
      : orders.filter(
          (order) => new Date(order.date).getFullYear().toString() === selectedYear
        );

  return (
    <div style={{margin: '24px'}}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Your Orders
        </Typography>

        <FormControl size="small" sx={{ width: "150px" }}>
          <InputLabel>Filter by Year</InputLabel>
          <Select
            value={selectedYear}
            label="Filter by Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {orderYears.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="left" mt={6}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography align="left" mt={4}>
          No orders found.
        </Typography>
      ) : (
        <>
          <Box sx={{ maxHeight: "600px", overflowY: "auto", pr: 1 }}>
          {filteredOrders.map((order) => (
            <Paper
              elevation={4}
              key={order.id}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "none",
                maxWidth: '800px'
              }}
            >

              <List dense>
                {order.items.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => {
                      const productId = item.productId;
                      if (productId) {
                        navigate(`/product/${productId}`);
                      } else {
                        console.error("Missing product ID:", item);
                      }
                    }}
                    sx={{
                      px: 0,
                      py: 1,
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={item.productDetails?.images?.[0] || "/placeholder-image.png"}
                        alt={item.name}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>{item.name}</Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity} &nbsp;|&nbsp; Price: ${item.price.toFixed(2)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography fontWeight="bold" sx={{color:"#167f81"}}>
                  Total: ₪{order.amount.toFixed(2)}
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Date: {new Date(order.date).toLocaleString()}
                </Typography>

                <Typography
                  fontWeight="bold"
                  sx={{color:"#167f81"}}
                >
                  Status: {order.status}
                </Typography>
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))}
          </Box>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
