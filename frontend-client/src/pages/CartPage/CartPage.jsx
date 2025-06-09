import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ButtonComponent from "../../widgets/ButtonComponent";
import { useCart } from "../../context/CartContext";
import styles from "./Cart.module.css";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";
import Checkbox from '../../widgets/Checkbox';
import {Snackbar, Alert} from "@mui/material";
const CartPage = ({ user }) => {
  const { items = [], add, remove, clearAll } = useCart();

  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Select all toggle
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.productId));
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

const getTotalPrice = () =>
  items.reduce((total, item) => {
    const product = products[item.productId];
    if (!product) return total; // skip if product data isn't loaded yet

    const price = parseFloat(product.price) || 0;
    const discount = parseFloat(product.discount) || 0;
    const quantity = item.quantity;

    const final = price * (1 - discount / 100) * quantity;
    return total + final;
  }, 0);



  useEffect(() => {
    // call api to get the products data that saved in the cart
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/cart/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const products = {};

        for (const product of response.data.data) {
          products[product.id] = product;
        }
        setProducts(products);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    }

    fetchData();
    // update state, make it object

  }, []);

  if (!user) {
    return (
      <div className={styles.cartContainer} style={{margin: 'auto', marginTop: '100px'}}>
        <p className={styles.emptyCart}>Please log in to view your cart items.</p>
      </div>
    )
  }
  
  return (
    <div className={styles.cartContainer}>
        {items.length > 0 ? (
          <>
            <div className={styles.topHolder}>
              <div style={{display: 'flex'}}>
                <Checkbox
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  label={'Select All'}
                  sx={{marginTop: '0px !important'}}
                />
                <p style={{marginLeft: '20px', fontWeight: 500}}>(Total: <span style={{fontWeight: 600, color: 'black', marginRight: '3px'}}>{getTotalPrice()}</span>₪)</p>
              </div>
              <div>
                <ButtonComponent
                  text="Clear Cart"
                  onClick={clearAll}
                  variant="outlined"
                  capitalize
                  icon={<DeleteOutlineIcon />}
                  sx={{width: '160px !important', marginRight: '20px'}}
                />
                <ButtonComponent
                  text="Buy Now"
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      setOpenSnackbar(true);
                      return;
                    }

                    const filteredSelectedItems = [];
                    for (const id of selectedItems) {
                      const product = products[id];
                      const item = items.filter(item => item.productId === id)?.[0];
                      if (!product) continue;
                      if (!item) continue;

                      filteredSelectedItems.push({...product, ...item});
                    }
                    navigate("/checkout", { state: { selectedItems: filteredSelectedItems } });
                  }}
                  sx={{width: '130px !important'}}
                />
              </div>
            </div>
            {items.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div
                  key={product.id}
                  className={styles.cartItem}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Checkbox
                    checked={selectedItems.includes(product.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleItemSelection(product.id)}
                  />
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.cartImage}
                  />
                  <div className={styles.cartDetails}>
                    <div style={{ display: "flex", justifyContent: 'space-between' }}>
                      <div
                        style={{
                          flexDirection: "column",
                          alignItems: "left",
                        }}
                      >
                        <p style={{ textAlign: "start" }}>
                          <strong>{product.name}/</strong> {product.brand}
                        </p>
                        <p style={{
                          width: "460px",
                          textAlign: "start",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {product.description}
                        </p>
                        {product.colors && (
                          <div
                            style={{
                              marginLeft:"15px",
                              marginTop:"15px",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor:  item.color || product.colors[0],
                              border: "1px solid #ccc",
                            }}
                            title={`Selected color: ${ item.color || product.colors[0]}`}
                          />
                        )}
                      </div>
                      <div style={{ width: '160px',
                          display: 'flex',
                          flexFlow: 'column',
                          alignItems: 'end'}}>
                        <p style={{ width: 'fit-content', fontWeight: 600, fontSize: '17px' }}>
                          {product.discount > 0 && <span style={{ width: 'fit-content', color: "red", fontWeight: 400, fontSize: '14px', marginRight: '10px' }}>%{product.discount}</span>}
                          {(product.price * (1 - product.discount / 100) * item.quantity).toFixed(2)} <span style={{fontWeight: 400}}>₪</span>
                        </p>

                      {product.discount > 0 && <p style={{ width: 'fit-content', color: "gray", fontSize:"16px", textDecoration: 'line-through' }}>{(product.price).toFixed(2)} ₪</p>}
                      </div>
                    </div>

                    <div className={styles.cartItemLine}>
                      <div className={styles.quantityControls}>
                        <IconButton
                          sx={{ color: "#167f81" }}
                          disabled={item.quantity === 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            add({
                              productId: product.id,
                              quantity: item.quantity - 1,
                              color: item.color,
                            });
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <span>{item.quantity}</span>
                        <IconButton
                          sx={{ color: "#167f81" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            add({
                              productId: product.id,
                              quantity: item.quantity + 1,
                              color: item.color,
                            });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(product.id);
                        }}
                        className={styles.trashIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p className={styles.emptyCart}>Your cart is empty.</p>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="warning"
            elevation={6}
            sx={{ width: '100%' }}
          >
            Please select at least one item to purchase.
          </Alert>
        </Snackbar>
    </div>
  );

};

export default CartPage;
