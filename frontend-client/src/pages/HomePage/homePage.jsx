import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/Product/ProductCard";
import AdvertisementSlider from "../../components/AdvertisementCard/AdvertisementSlider";
import "./homePage.css";

const HomePage = ({user}) => {
  const { filters, setFilters } = useOutletContext(); // From MiniDrawer
  const [products, setProducts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    if (categoryName) {
      setFilters(prev => ({
        ...prev,
        category: categoryName,
      }));
    }
  }, [categoryName, setFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get("http://localhost:4000/api/product/list");
        setProducts(productRes.data.data.products);
        setFilteredProducts(productRes.data.data.products);

        const adsRes = await axios.get("http://localhost:4000/api/ads/approved");
        console.log("Approved Ads:", adsRes.data);
        setAdvertisements(adsRes.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const query = new URLSearchParams();
        if (filters.category) query.append("category", filters.category);
        if (filters.brand) query.append("brand", filters.brand);
        if (filters.priceRange[0] !== 0) query.append("minPrice", filters.priceRange[0]);
        if (filters.priceRange[1] !== Number.MAX_SAFE_INTEGER) query.append("maxPrice", filters.priceRange[1]);

        const res = await axios.get(`http://localhost:4000/api/product/filter?${query.toString()}`);
        let products = res.data.products;

        if (filters.priceSort === "asc") {
          products.sort((a, b) => a.price - b.price);
        } else if (filters.priceSort === "desc") {
          products.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(products);
      } catch (err) {
        console.error("Failed to fetch filtered products", err);
      }
    };

    fetchFilteredProducts();
  }, [filters]);

  return (
    <>
      {Array.isArray(advertisements) && advertisements.length > 0 && (
        <div className="advertisement-section">
          <AdvertisementSlider />
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} user={user}/>
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
