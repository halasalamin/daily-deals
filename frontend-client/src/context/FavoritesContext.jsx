import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getUserFavorites();
  }, []);


  const getUserFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(response.data.data);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
    }
  };

  const getUserFavoriteProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/favorites/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      return [];
    }
  };


  const add = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/favorites",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(response.data.data);
    } catch (error) {
      console.error("Failed to add to favorites:", error);

    }
  };

  const remove = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        "http://localhost:4000/api/favorites/" + productId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(response.data.data);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
    }
  };

  const clearAll = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        "http://localhost:4000/api/favorites" ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites([]);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
    }
  };

  const clearFavoriteStorage = () => {
      setFavorites([]);
  };

  const isFavorite = (productId) => !!favorites.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        add,
        remove,
        clearAll,
        isFavorite,
        getUserFavorites,
        getUserFavoriteProducts,
        clearFavoriteStorage,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
