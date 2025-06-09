import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Select,
} from "@mui/material";
import GeneralDialog from "../../widgets/Dialog";
import ButtonComponent from "../../widgets/ButtonComponent";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const MAX_VISIBLE_IMAGES = 5;

const UpdateProductDialog = ({ open, onClose, onUpdate, product }) => {
  const [form, setForm] = useState({
    id: "",
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
    await axios.put(
      `http://localhost:4000/api/product/update/${updatedProductData.id}`,
      updatedProductData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // if needed
        },
      }
    );
    // optionally refresh product list here
  } catch (error) {
    console.error("Update failed", error);
  }
};

    useEffect(() => {
    if (open && product) {
        setForm({
        id: product.id,
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
    console.log(">>>>!!!!", indexToRemove, updatedColors)
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
      title="Edit Product"
      onClose={onClose}
      onCancel={onClose}
      submitText="Update"
      cancelText="Close"
      onSubmit={handleSubmit}
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
        onClick={() => handleRemoveColor(index)}
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
           src={typeof image === "string" ? image : URL.createObjectURL(image)}
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

export default UpdateProductDialog;
