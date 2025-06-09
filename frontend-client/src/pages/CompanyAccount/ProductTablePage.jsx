import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import classes from "./products.module.css"
import { EditIcon, DeleteIcon } from "../../icons";
import ButtonComponent from "../../widgets/ButtonComponent";
import ManageProductsDialog from "../../components/Dialog/ManageProductsDialog";
import UpdateProductDialog from "../../components/Dialog/UpdateProductDialog";


const rowsPerPageOptions = [10, 25, 100];

const ExistingProducts = ({ company }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openManageProductsDialog, setOpenManageProductsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openUpdateProductsDialog, setOpenUpdateProductsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedRows = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const token = localStorage.getItem("token");
  const backendUrl = "http://localhost:4000/api/product";

  useEffect(() => {
    if (company?.companyId) {
      fetchProducts(company.companyId);
    }
  }, [company]);

  const fetchProducts = async (companyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendUrl}/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProducts(company.companyId);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      renderCell: ({ value }) => (
        <Tooltip title={value || ""}>
          <span>
            {value?.length > 60 ? `${value.substring(0, 60)}...` : value}
          </span>
        </Tooltip>
      ),
    },
    {
      field:"Availability", headerName:"Availability", flex: 1,
      renderCell: (params) => (
        <Typography
          display="flex"
          alignItems="center"
          height="100%"
          width="100%"
          color={params.row.status ? "green" : "red"}
        >
          {params.row.status}
        </Typography>
      ),
    },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "discount", headerName: "Discount", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "colors",
      headerName: "Colors",
      flex: 1,
      renderCell: ({ value }) =>
        (value || []).map((color, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: color,
              marginRight: 4,
              border: "1px solid #ccc",
            }}
            title={color}
          />
        )),
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 80,
      maxWidth: 80,
      headerClassName: 'header-center',
      cellClassName: classes.cellCenter,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setSelectedProduct(params.row);
            setOpenUpdateProductsDialog(true);
          }}
          sx={{ color: 'gray', fontSize: 20 }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'header-center',
      cellClassName: classes.cellCenter,

      renderCell: (params) => (
        <IconButton
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this product?"))
                handleDelete(params.row.id);
            }}
            disabled={loading}
          sx={{ fontSize: 20 }}
        >
          <DeleteIcon color={'#80808080'}/>
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <div className={classes.addButtonContainer}>
        <ButtonComponent  sx={{minWidth: '210px'}} onClick={() => setOpenManageProductsDialog(true)}>
          {`Add New Product`}
        </ButtonComponent>
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} className={classes.paperPadding} sx={{padding: '16px 36px 36px 36px', display: 'flex'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', marginTop: '8px', alignItems: 'center'}}>
          <TextField
              placeholder="Search by name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reset to page 0 after search
              }}
              sx={{
                width: '300px',
                height: '40px',
                '& .MuiInputBase-root': {
                  height: '40px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
          />
          <TablePagination
              sx={{ minHeight: '38px !important', maxHeight: '38px !important',
              '& .MuiTablePagination-toolbar': {
                maxHeight: '36px !important',
                minHeight: '36px !important'
              }
              }}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
            <DataGrid
              hideFooter
              className={classes.gridContainer}
              rows={paginatedRows}
              getRowId={(row) => row.id}
              columns={columns}
              disableRowSelectionOnClick
            />
        </Paper>
        {openManageProductsDialog && <ManageProductsDialog open={openManageProductsDialog} onClose={() => setOpenManageProductsDialog(false)} />}
        {openUpdateProductsDialog && (
          <UpdateProductDialog
            open={openUpdateProductsDialog}
            onClose={() => {
              setOpenUpdateProductsDialog(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onUpdated={() => fetchProducts(company.companyId)}
          />
        )}
    </>
  );
};

export default ExistingProducts;
