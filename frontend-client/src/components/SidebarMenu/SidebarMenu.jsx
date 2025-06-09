import React, { useState, useEffect } from "react";
import {
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import styles from "./SidebarMenu.module.css";
import ButtonComponent from "../../widgets/ButtonComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ToggleSection = ({ title, expanded, onToggle, children }) => (
  <div>
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        padding: "0px 16px",
        background: "#fff",
        // borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        height: '60px'
      }}
    >
      <p style={{ fontWeight: 500 }}>
        {title}
      </p>
      <ExpandMoreIcon sx={{
          color: "gray",
          transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    </div>
    <div
      style={{
        maxHeight: expanded ? "500px" : 0,
        overflow: "hidden",
        transition: "max-height 0.3s ease",
        padding: expanded ? "10px 16px" : "0 16px",
        paddingRight: "6px",
      }}
    >
      {children}
    </div>
  </div>
);

const SidebarMenu = ({ open, onClose, filters = {}, setFilters, focusedSection }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState({
    category: false,
    brand: false,
    price: false
  });

  useEffect(() => {
    if (focusedSection) {
      setExpanded({
        category: focusedSection === "category",
        brand: focusedSection === "brand",
        price: focusedSection === "price"
      });
    }
  }, [focusedSection]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(response.data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleApplyRange = () => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

    if (min > max) {
      alert("Minimum price should not exceed maximum price.");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const handleClearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    setFilters({
      category: null,
      brand: null,
      priceSort: null,
      priceRange: [0, Number.MAX_SAFE_INTEGER],
    });
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.sidebarDrawer,
      }}
    >
    <div className={styles.sidebarContent}>
  <div style={{ display: "flex", flexDirection: "column", overflow: 'hidden' }}>

    {/* Category */}
    <ToggleSection
      title="Category"
      expanded={expanded.category}
      onToggle={() =>
        setExpanded((prev) => ({ ...prev, category: !prev.category, price: false, brand: false }))
      }
    >
      {loading ? (
        <Typography>Loading...</Typography>
      ) : categories.length > 0 ? (
        <div
          style={{
            maxHeight: "400px",
           overflowY: "auto",
           overflowX: "hidden",
           scrollbarWidth: "thin", // For Firefox
           WebkitOverflowScrolling: "touch",
           paddingRight: "4px"
          }}
        >
        <div>
        <List dense disablePadding>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              component="button"
              onClick={() =>
                setFilters((prev) => ({ ...prev, category: category.name }))
              }
              className={`${styles.dropdownItem} ${
                filters.category === category.name ? styles.active : ""
              }`}
            >
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        </div>
        </div>
      ) : (
        <Typography>No categories available</Typography>
      )}
    </ToggleSection>

    {/* Brand */}
    <ToggleSection
      title="Brand"
      expanded={expanded.brand}
      onToggle={() =>
        setExpanded((prev) => ({ ...prev, brand: !prev.brand, category: false, price: false }))
      }
    >
    <div
      style={{
        maxHeight: "400px",
       overflowY: "auto",
       overflowX: "hidden",
       scrollbarWidth: "thin", // For Firefox
       WebkitOverflowScrolling: "touch",
       paddingRight: "4px"
      }}
    >
    <div>
      <List dense disablePadding>
        {["HP", "Dell", "Lenovo", "Asus", "Razer", "Apple", "Samsung"].map(
          (brand) => (
            <ListItem
              key={brand}
              component="button"
              onClick={() =>
                setFilters((prev) => ({ ...prev, brand }))
              }
              className={`${styles.dropdownItem} ${
                filters.brand === brand ? styles.active : ""
              }`}
            >
              <ListItemText primary={brand} />
            </ListItem>
          )
        )}
      </List>
      </div>
      </div>
    </ToggleSection>

    {/* Price */}
    <ToggleSection
      title="Price"
      expanded={expanded.price}
      onToggle={() =>
        setExpanded((prev) => ({ ...prev, price: !prev.price, category: false, brand: false }))
      }
    >
      <List dense>
        <ListItem
          component="button"
          onClick={() =>
            setFilters((prev) => ({ ...prev, priceSort: "desc" }))
          }
          className={`${styles.dropdownItem} ${
            filters.priceSort === "desc" ? styles.active : ""
          }`}
        >
          <ListItemText primary="High to Low" />
        </ListItem>
        <ListItem
          component="button"
          onClick={() =>
            setFilters((prev) => ({ ...prev, priceSort: "asc" }))
          }
          className={`${styles.dropdownItem} ${
            filters.priceSort === "asc" ? styles.active : ""
          }`}
        >
          <ListItemText primary="Low to High" />
        </ListItem>

        <div style={{ display: "flex", gap: 10, marginTop: 30, justifyContent: 'center' }}>
          <TextField
            label="Min"
            size="small"
            value={minPrice}
            type="number"
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: "100px" }}
          />
          <TextField
            label="Max"
            size="small"
            value={maxPrice}
            type="number"
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: "100px" }}
          />
        </div>
        <ButtonComponent
          variant="outlined"
          color="primary"
          sx={{ width: '140px !important', height: '35px !important', marginTop: '20px' }}
          capitalize
          onClick={handleApplyRange}
        >
          Apply Range
        </ButtonComponent>
      </List>
    </ToggleSection>
  </div>

  <div style={{ padding: "1rem" }}>
    <ButtonComponent
      variant="outlined"
      color="secondary"
      fullWidth
      onClick={handleClearAll}
    >
      Clear All Filters
    </ButtonComponent>
  </div>
</div>
    </Drawer>
  );
};

export default SidebarMenu;
