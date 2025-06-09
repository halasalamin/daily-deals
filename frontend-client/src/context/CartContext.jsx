import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getUserCart();
  }, []);

  const getUserCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to add to cart:", error);

    }
  };

 // Add product to the cart with an optional discount
  const add = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/cart",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to add to cart:", error);

    }
  };

  const remove = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        "http://localhost:4000/api/cart/" + productId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const clearAll = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        "http://localhost:4000/api/cart" ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems([]);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const clearCartStorage = () => {
      setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart: [],
        items,
        add,
        remove,
        clearAll,
        getUserCart,
        clearCartStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
