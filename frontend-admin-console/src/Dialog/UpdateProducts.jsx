import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Select,
  Dialog,
} from "@mui/material";
import GeneralDialog from "../widgets/Dialog";
import ButtonComponent from "../components/ButtonComponent";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const MAX_VISIBLE_IMAGES = 5;

const UpdateProductDialog = ({ open, onClose, product }) => {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    brand: "",
    category: "",
    colors: [],
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [colorInput, setColorInput] = useState("#000000");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  const handleUpdateProduct = async (updatedProductData) => {
  try {
    const formData = new FormData();

    // Append basic fields
    formData.append("productId", updatedProductData.productId);
    formData.append("name", updatedProductData.name);
    formData.append("description", updatedProductData.description);
    formData.append("price", updatedProductData.price);
    formData.append("discount", updatedProductData.discount);
    formData.append("quantity", updatedProductData.quantity);
    formData.append("brand", updatedProductData.brand);
    formData.append("category", updatedProductData.category);

    // Append colors
    updatedProductData.colors.forEach((color) =>
      formData.append("colors[]", color)
    );

    // Append only File images (new ones)
    updatedProductData.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("photos", img);
      }
    });

    await axios.put(
      `http://localhost:4000/api/product/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Update failed", error);
  }
};

    useEffect(() => {
    if (open && product) {
        setForm({
        productId: product.id,
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discount: product.discount || "",
        quantity: product.quantity || "",
        brand: product.brand || "",
        category: product.category || "",
        colors: product.colors || [],
        images: product.images || [],
        });
        fetchCategories();
    }
    }, [open, product]);


  const fetchCategories = () => {
    axios
      .get("http://localhost:4000/api/categories")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const handleChange = (field, value) => {
    if (field === "photos" && value instanceof FileList) {
      setForm((prev) => ({ ...prev, images: Array.from(value) }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddColor = () => {
    if (!form.colors.includes(colorInput)) {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, colorInput] }));
    }
  };

  const handleRemoveColor = (indexToRemove) => {
    const updatedColors = form.colors.filter((_, i) => i !== indexToRemove);
    setForm((prev) => ({ ...prev, colors: updatedColors }));
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = form.images.filter((_, i) => i !== indexToRemove);
    setForm((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = () => {
    handleUpdateProduct(form);
    onClose();
  };

  return (
    <GeneralDialog
      open={open}
      title="Update Product"
      onClose={onClose}
      onCancel={onClose}
      cancelText="Close"
      onSubmit={handleSubmit}
      submitText="Update"
      submitBtnDisabled={
        !form.name || !form.description || !form.price || !form.quantity || !form.category || !form.brand
      }
      cancelBtnWidth="150px"
      submitBtnWidth="150px"
    >
      <div style={{ width: "750px", display: "flex", gap: 24, padding: "20px 10px 12px 10px" }}>
        <div style={{ width: "250px", minWidth: "250px", display: "flex", flexFlow: "column nowrap", gap: 14 }}>
          <p style={{ fontSize: "12px", color: "#167f81", margin: 0, marginBottom: '-10px' }}>Product Name</p>
          <TextField size="small" value={form.name} onChange={(e) => handleChange("name", e.target.value)} fullWidth />

          <p style={{ fontSize: "12px", color: "#167f81", margin: 0, marginBottom: '-10px' }}>Brand</p>
          <TextField size="small" value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} fullWidth />

          <p style={{ fontSize: "12px", color: "#167f81", margin: 0, marginBottom: '-10px' }}>Category</p>
          <Select
            size="small"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            displayEmpty
            renderValue={(selected) =>
              selected
                ? categories.find((cat) => cat.id === selected)?.name
                : <span style={{ color: "#999999cc" }}>Select category</span>
            }
            sx={{
              textAlign: "left",
              "& .MuiSelect-select": { textAlign: "left", paddingLeft: "10px" },
            }}
          >
            <MenuItem disabled value="">
              Select category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <p style={{ fontSize: "12px", color: "#167f81", margin: 0 }}>Colors</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              style={{ width: 23, height: 23, borderRadius: "50%" }}
            />
            <ButtonComponent
              text="Add Color"
              variant="outlined"
              capitalize
              sx={{ border: "none", width: "150px", height: "35px", marginLeft: "12px" }}
              onClick={handleAddColor}
              icon={<AddIcon />}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {form.colors.map((color, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #888",
                }}
                title={color}
              >
                <IconButton
                  onClick={() => handleRemoveColor(index)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "#fff",
                    padding: "2px",
                    "&:hover": { backgroundColor: "#eee" },
                  }}
                >
                  <CloseIcon style={{ fontSize: "12px" }} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexFlow: "column nowrap", flexGrow: 1 }}>
          <p style={{ fontSize: "12px", color: "#167f81", margin: 0, marginBottom: '4px' }}>Description</p>
          <TextField
            fullWidth
            multiline
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                height: "115px",
                alignItems: "start",
              },
              "& .MuiInputBase-input": {
                height: "100%",
                boxSizing: "border-box",
              },
            }}
          />

          <div style={{ display: "flex", marginTop: "33px", gap: 12 }}>
            <TextField
              placeholder="Price (₪)"
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              placeholder="Discount (%)"
              type="number"
              value={form.discount}
              onChange={(e) => handleChange("discount", e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              fullWidth
              size="small"
            />
          </div>

          <p style={{ fontSize: "12px", color: "#167f81", margin: "16px 0 6px" }}>Upload Product Images</p>
          <div
            onClick={handleDivClick}
            style={{
              border: "1px dashed #ccc",
              display: "flex",
              height: "120px",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
              flexFlow: "column nowrap",
            }}
          >
            <span style={{ color: "#888", fontSize: "14px" }}>
              Drag & drop files here or click to upload
            </span>
            <div style={{ marginTop: "16px", display: "flex", gap: 4 }}>
              {form.images?.slice(0, MAX_VISIBLE_IMAGES).map((file, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={typeof file === "string" ? file : URL.createObjectURL(file)}
                  alt="preview"
                  sx={{ width: 60, height: 60, objectFit: "cover", border: "1px solid #ccc" }}
                />
              ))}
            </div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleChange("photos", e.target.files)}
            />
          </div>
        </div>
      </div>
    </GeneralDialog>
  );
};

export default UpdateProductDialog;
