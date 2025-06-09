import {
  Button,
  IconButton,
  Paper,
  TablePagination,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCompanyDialog from "../../Dialog/AddCompany";
import ExistingProductsDialog from "../../Dialog/ProductsDialog";
import SearchIcon from '@mui/icons-material/Search';
import {Snackbar, Alert} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import EditCompanyDialog from "../../Dialog/EditInformation";
import styles from './company.module.css';
import { useDashboardLogic } from '../../hooks/useDashboardLogic';
import { EditIcon, DeleteIcon } from "../../icons";

const rowsPerPageOptions = [10, 25, 100];


export default function ServiceParams(props) {
    const [page, setPage] = useState(0); // starts from 0
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyNameQuery, setCompanyNameQuery] = useState("");

    

    const handleChangePage = (newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // reset to first page
    };

    const [openDialog, setOpenDialog] = useState(false);
    const token = localStorage.getItem('token');
    const {
      selectedCompanyId, setSelectedCompanyId,
      companies, setEditedName, setEditedDescription,
      fetchCompanies, deleteCompanyByName,
      snackbarOpen,
      snackbarMessage,
      snackbarSeverity,
      handleSnackbarClose,
    } = useDashboardLogic();
    
    const [productDialogOpen, setProductDialogOpen] = useState(false);

    const allRows = companies.map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description,
      owner: company.owner?.username || '',
      email: company.owner?.email || '',
      products: company.products || [],
    }));

    const filteredRows = allRows.filter(row =>
      row.name.toLowerCase().includes(companyNameQuery.toLowerCase())
    );

    const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const rowsToDisplay = paginatedRows;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [])
;

   const columns = [
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, },
      { field: 'description', headerName: 'Description', flex: 1, minWidth: 150,},
      { field: 'owner', headerName: 'Username', flex: 1, minWidth: 150, },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 150, },
      {
        field: 'products',
        headerName: 'Products',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <span
            style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
            onClick={() => {
              setSelectedCompanyId(params.row.id);
              setProductDialogOpen(true);
            }}
          >
            View products
          </span>
        ),
      },
      {
        headerName: 'Edit',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        minWidth: 80,
        maxWidth: 80,
        headerClassName: 'header-center',
        cellClassName: styles.cellCenter,

        renderCell: (params) => (
          <IconButton
            onClick={() => {
              setSelectedCompany(params.row); // pass entire company
              setEditedDescription(params.row.description);
              setEditedName(params.row.name);
              setEditDialogOpen(true); // open edit dialog
            }}
            sx={{ color: 'gray', fontSize: 20 }}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      {
        field: 'actions',
        headerName: 'Delete',
        flex: 1,
        minWidth: 80,
        maxWidth: 80,
        sortable: false,
        disableColumnMenu: true,
        headerClassName: 'header-center',
        cellClassName: styles.cellCenter,

        renderCell: (params) => (
          <IconButton
            onClick={() => deleteCompanyByName(params.row.name)}
            sx={{ fontSize: 20 }}
          >
            <DeleteIcon color={'#80808080'}/>
          </IconButton>
        ),
      },
    ];


  return (
    <>
        <div className={styles.addButtonContainer}>
          <Button className="button" onClick={handleOpenDialog}>
            {`Add New Company`}
          </Button>
        </div>
        <Paper elevation={0} className={styles.paperPadding} sx={{padding: '16px 36px 36px 36px', display: 'flex'}}>
          {/* External Footer Pagination */}
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', marginTop: '8px', alignItems: 'center'}}>
          <TextField
             placeholder="Search by name"
             variant="outlined"
             size="small"
             value={companyNameQuery}
            onChange={(e) => {
              setCompanyNameQuery(e.target.value);
              setPage(0); // Reset pagination
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
              count={allRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
            <DataGrid
              rows={rowsToDisplay}
              columns={columns}
              disableSelectionOnClick
              hideFooter
              className={styles.gridContainer}
            />
        </Paper>

        {openDialog &&
          <AddCompanyDialog
            open={openDialog}
            onClose={handleCloseDialog}
            fetchCompanies={fetchCompanies}
            token={token}
          />
        }
        {productDialogOpen &&
          <ExistingProductsDialog
            open={productDialogOpen}
            onClose={() => setProductDialogOpen(false)}
            companyId={selectedCompanyId}
        />}
        {editDialogOpen && selectedCompany && (
          <EditCompanyDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            company={selectedCompany}
          />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </>
  );
}
