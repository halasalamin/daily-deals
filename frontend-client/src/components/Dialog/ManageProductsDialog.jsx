import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import GeneralDialog from "../../widgets/Dialog";
import ButtonComponent from "../../widgets/ButtonComponent";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";

const MAX_VISIBLE_IMAGES = 5;

const ManageProductsDialog = ({ open, onClose, buttonWidth }) => {
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [colorInput, setColorInput] = useState("#000000");
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
    brand: "",
    colors: [],
    images: [],
  });

  const token = localStorage.getItem("token");
  const backendUrl = "http://localhost:4000/api/product";

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:4000/api/categories")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const fetchProducts = () => {
    axios
      .get(`${backendUrl}/list`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleChange = (field, value) => {
    if (field === "photos" && value instanceof FileList) {
      setForm((prev) => ({ ...prev, images: Array.from(value) }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
   const updatedImages = form.images.filter((_, i) => i !== indexToRemove);
   setForm((prev) => ({ ...prev, images: updatedImages }));
 };

  const handleAddColor = () => {
    if (!form.colors.includes(colorInput)) {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, colorInput] }));
    }
  };

  const handleAddOrUpdate = async () => {
    const { name, description, price, discount, quantity, images, colors, category, brand } = form;
    if (!name || !description || !price || !quantity || !category || !brand) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", Number(price).toString());
    formData.append("discount", Number(discount).toString());
    formData.append("stockQty", Number(quantity).toString());
    formData.append("category", category);
    formData.append("brand", brand);
    colors.forEach((color) => formData.append("color", color));
    images.forEach((file) => formData.append("photos", file));

    try {
      if (editingId !== null) {
        formData.append("id", editingId.toString());
        await axios.put(`${backendUrl}/update`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(`${backendUrl}/add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error adding/updating product:", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      discount: "",
      quantity: "",
      category: "",
      brand: "",
      colors: [],
      images: [],
    });
  };

  return (
    <GeneralDialog
      open={open}
      title="Manage Products"
      onClose={onClose}
      onCancel={onClose}
      cancelText="Close"
      onSubmit={handleAddOrUpdate}
      submitText={editingId !== null ? "Update Product" : "Add Product"}
      submitBtnDisabled={!form.name || !form.description || !form.price || !form.quantity || !form.category || !form.brand}
      cancelBtnWidth="150px"
      submitBtnWidth="150px"
    >
      <div style={{width: '750px', display: 'flex', gap: 24, padding: '20px 10px 12px 10px'}}>
      <div style={{width: '250px', minWidth: '250px', display: 'flex', flexFlow: 'column nowrap', gap: 14}}>
        <p style={{width: 'fit-content', marginBottom: '-8px', marginTop: 0, fontSize: '12px',
        color: '#167f81'}}>Product Name</p>
        <TextField
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        size="small"
        />

        <p style={{width: 'fit-content', marginBottom: '-8px', marginTop: 0, fontSize: '12px',
        color: '#167f81'}}>Brand</p>
        <TextField
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
          fullWidth
          size="small"
        />

        <p style={{width: 'fit-content', marginBottom: '-8px', marginTop: 0, fontSize: '12px',
        color: '#167f81'}}>Category</p>
          <Select
            displayEmpty
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Category"
            size="small"
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: '#999999cc' }}>Select category</span>;
              }
              const selectedCategory = categories.find(cat => cat.id === selected);
              return selectedCategory ? selectedCategory.name : '';
            }}
            sx={{
              textAlign: 'left',
              '& .MuiSelect-select': {
                textAlign: 'left',
                paddingLeft: '10px',
              },
            }}
          >
            <MenuItem disabled value="" sx={{display: 'none'}}>
              Select category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <p style={{width: 'fit-content', marginBottom: '-8px', marginTop: 0, fontSize: '12px',
          color: '#167f81'}}>Colors</p>
          <div style={{display: 'flex', alignItems: 'center'}}>

            <input
              type="color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              style={{
                  width: 23,
                  height: 23,
                  borderRadius: '50%',
                  backgroundColor: colorInput,
                  margin: 0
              }}
            />
          <ButtonComponent
            text="Add Color"
            variant="outlined"
            capitalize
            sx={{ border: 'none', width: '150px', height: '35px', marginLeft: '12px' }}
            onClick={handleAddColor}
            icon={<AddIcon />}
          />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
  {form.colors.map((color, index) => (
    <div
      key={index}
      style={{
        position: 'relative',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid #888',
      }}
      title={color}
    >
      <IconButton
        onClick={() => {
          const updated = form.colors.filter((_, i) => i !== index);
          setForm(prev => ({ ...prev, colors: updated }));
        }}
        size="small"
        sx={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          backgroundColor: '#fff',
          padding: '2px',
          '&:hover': {
            backgroundColor: '#eee',
          },
        }}
      >
        <CloseIcon style={{ fontSize: '12px' }} />
      </IconButton>
    </div>
  ))}
</div>
      </div>


      <div style={{display: 'flex', flexFlow: 'column nowrap'}}>
        <p style={{width: 'fit-content', marginBottom: '6px', marginTop: 0, fontSize: '12px',
        color: '#167f81'}}>Description</p>
        <TextField
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          multiline
           sx={{
            '& .MuiInputBase-root': {
              alignItems: 'start',
              maxHeight: '114.4px',
              minHeight: '114.4px',
              paddingTop: '12px'
            },
            '& .MuiInputBase-inputMultiline': {
              maxHeight: '90px',
              overflow: 'auto',
            },
          }}
        />
        <div style={{display: 'flex', marginTop: '14px', gap: 12}}>
          <div>
            <p style={{width: 'fit-content', marginBottom: '6px', marginTop: 0, fontSize: '12px',
            color: '#167f81'}}>Price (₪)</p>
            <TextField
              placeholder="Price (₪)"
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              fullWidth
              size="small"
            />
          </div>
          <div>
            <p style={{width: 'fit-content', marginBottom: '6px', marginTop: 0, fontSize: '12px',
            color: '#167f81'}}>Discount (%)</p>
          <TextField
            placeholder="Discount (%)"
            type="number"
            value={form.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            fullWidth
            size="small"
          />
          </div>
          <div>
            <p style={{width: 'fit-content', marginBottom: '6px', marginTop: 0, fontSize: '12px',
            color: '#167f81'}}>Quantity</p>
          <TextField
            placeholder="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            fullWidth
            size="small"
          />
          </div>
          </div>

          <p style={{width: 'fit-content', marginBottom: '6px', marginTop: '16px', fontSize: '12px',
          color: '#167f81'}}>Upload Product Images</p>
          <div
          onClick={handleDivClick}
          style={{
            border: '1px dashed #ccc',
            display: 'flex',
            height: '120px',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            flexFlow: 'column nowrap'
          }}
        >
       <span style={{ color: "#888", fontSize: "14px" }}>
         Drag & drop files here or click to upload
       </span>
       <div style={{marginTop: '16px', display: 'flex'}}>
     {form.images.slice(0, MAX_VISIBLE_IMAGES).map((image, idx) => (
       <Box
         key={idx}
         sx={{
           position: "relative",
           width: 60,
           height: 60,
           borderRadius: 1,
           overflow: "hidden",
           border: "1px solid #ccc",
           marginRight: '12px'
         }}
         onClick={(e) => e.stopPropagation()} // prevent image click from triggering file input
       >
         <img
           src={URL.createObjectURL(image)}
           alt="preview"
           style={{
             width: "100%",
             height: "100%",
             objectFit: "cover",
           }}
         />
         <IconButton
           size="small"
           onClick={() => handleRemoveImage(idx)}
           sx={{
             position: "absolute",
             top: '-1px',
             right: 0,
             padding: "1px",
             background: "#ccc6",
             '&:hover': { background: "#eee" },
           }}
         >
           <CloseIcon fontSize="small" />
         </IconButton>
       </Box>
     ))}

     {form.images.length > MAX_VISIBLE_IMAGES && (
       <Box
         sx={{
           width: 60,
           height: 60,
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           backgroundColor: "#f0f0f0",
           border: "1px solid #ccc",
           borderRadius: 1,
           fontSize: 12,
           fontWeight: 500,
           color: "#555",
         }}
       >
         +{form.images.length - MAX_VISIBLE_IMAGES} more
       </Box>
     )}
     </div>
          <input
            type="file"
            ref={fileInputRef}
            name="product-images"
            multiple
            accept="image/*"
            onChange={(e) => handleChange("photos", e.target.files)}
            style={{ display: 'none' }}
          />
          </div>
      </div>
      </div>
    </GeneralDialog>
  );
};

export default ManageProductsDialog;
