import React, { useEffect, useState } from "react";
import {
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { EditIcon, DeleteIcon } from "../icons";
import UpdateProductDialog from "./UpdateProducts";
import Dialog from '../widgets/Dialog';


const ExistingProductsDialog = ({ open, onClose, companyId }) => {
  const [products, setProducts] = useState([]);
  const backendUrl = "http://localhost:4000/api/product";
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (open && companyId) fetchProducts();
  }, [open, companyId]);

  const fetchProducts = () => {
    axios
      .get(`${backendUrl}/company/${companyId}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleDelete = async (productId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this product?");
  if (!isConfirmed) return;

  try {
    const response = await axios.delete(`${backendUrl}/remove-product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    if (response.data.success) {
      alert("Product is now marked as unavailable (soft deleted).");
      fetchProducts();
    } else {
      alert("Failed to remove product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while removing the product.");
  }
};


  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
  };

  // Define columns for DataGrid
  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      margin:"14px !important",
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",      // Vertical centering
            justifyContent: "center",  // Horizontal centering (optional)
            width: "100%",
            height: "100%",            // Important: make sure it fills the cell
            overflow: "hidden",
          }}
        >
        <Typography
          noWrap
          title={params.value}
          sx={{
           width: '100%',
           textAlign: 'center',
           overflow: 'hidden',
           textOverflow: 'ellipsis',
           whiteSpace: 'nowrap',
         }}
        >
          {params.value}
        </Typography>
        </Box>
      ),
    },
    {field: "Availability", headerName: "Availability", width: 120, margin:"14px !important",
      renderCell: (params) => (
        <Typography sx={{display: 'flex', alignItems: 'center', height: '100%'}} color={params.row.status ? "green" : "red"}>
          {params.row.status}
        </Typography>
      ),
    },
    { field: "price", headerName: "Price", width: 100 },
    { field: "discount", headerName: "Discount", width: 100 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      field: "colors",
      headerName: "Colors",
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
          {params.value?.map((color, idx) => (
            <Box
              key={idx}
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: color,
                mr: 0.5,
                border: "1px solid #ccc",
              }}
              title={color}
            />
          ))}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton sx={{ color: "gray", fontSize: 20 }} onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ fontSize: 20 }}
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon color={"#80808080"} />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = products?.map((product) => ({
    id: product.id,
    ...product,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      title="Existing Products"
    >
      <div style={{padding: '20px 10px', minWidth: '1060px'}}>
        {products?.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            No products found for this company.
          </Typography>
        ) : (
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              disableSelectionOnClick
              autoHeight={false}
            />
          </Box>
        )}
      </div>
      <UpdateProductDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        product={selectedProduct}
      />
    </Dialog>
  );
};

export default ExistingProductsDialog;
