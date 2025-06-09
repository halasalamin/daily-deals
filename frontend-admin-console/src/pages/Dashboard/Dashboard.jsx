import React, { useEffect, useState } from 'react';
import {
  Box, Drawer, CssBaseline, Container, Button, TextField, FormControl,
  InputLabel, MenuItem, Select, List, ListItem, ListItemText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import styles from './Dashboard.module.css';
import ButtonComponent from '../../components/ButtonComponent';
import Company from '../../components/company/Company';
import { useDashboardLogic } from '../../hooks/useDashboardLogic';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminOrdersTable from '../../hooks/CustomerLogic';
import { useNavigate } from 'react-router-dom';
import SalesPredictionFlowchart from '../../components/Report/SalesPredictionFlowchart';
const drawerWidth = 250;

const AdminPanel = () => {
  const {
    email, setEmail, password, setPassword, username, setUsername,selectedCompanyId, setSelectedCompanyId,
    companies, showAddCompany, setShowAddCompany, showAddCompanyOwner, setShowAddCompanyOwner,
    fetchCompanies,handleAddCompanyOwner, deleteCompanyByName,
    handleLogout
  } = useDashboardLogic();

  const [editingCompany, setEditingCompany] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

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
      renderCell: (params) =>
        params.row.products.length > 0 ? (
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {params.row.products.map((product) => (
              <li key={product._id}>{product.name} - ${product.price}</li>
            ))}
          </ul>
        ) : (
          <span>No products</span>
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

      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setEditingCompany(params.row);
            setEditedName(params.row.name);
            setEditedDescription(params.row.description);
          }}
          sx={{ color: 'gray' }}
        >
          <EditDocumentIcon />
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

      renderCell: (params) => (
        <IconButton
          onClick={() => deleteCompanyByName(params.row.name)}
          sx={{ color: 'gray' }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const rows = companies.map((company, index) => ({
    id: company._id || index,
    name: company.name,
    description: company.description,
    owner: company.owner?.username || '',
    email: company.owner?.email || '',
    products: company.products || [],
  }));

  const navigate =useNavigate();
  useEffect(() => {
    if (selectedPage === 'Company') {
      navigate('/company')
    }
      fetchCompanies();
  }, [selectedPage]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#33b7c0',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <List>
            {['Admin', 'Company', 'Report', 'Users'].map((text) => (
              <ListItem
                button
                key={text}
                onClick={() => setSelectedPage(text)}
                sx={{
                  backgroundColor: selectedPage === text ? 'lightgray' : 'transparent',
                  '&:hover': { backgroundColor: 'gray' },
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            color='error'
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

        {/* Charts */}
        {selectedPage === 'Report' && (
          <>
             <SalesPredictionFlowchart />
          </>
        )}

{selectedPage === 'Customer Orders' && (
  <Container maxWidth="lg" className={styles.container}>
    <AdminOrdersTable />
  </Container>
)}

        {/* Company Section */}
        {selectedPage === 'Admin' && (
  <Container maxWidth="lg" className={styles.container}>
    {/* Buttons aligned to the right */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
      }}
    >
      <Button
        variant="standard"
        color="warning"
        onClick={() => setShowAddCompany(!showAddCompany)}
      >
        {showAddCompany ? 'Hide Add Company' : 'Add Company'}
      </Button>
      <Button
        variant="contained"
        onClick={() => setShowAddCompanyOwner(!showAddCompanyOwner)}
      >
        {'Add Company Owner'}
      </Button>
      {/* <TextField
        size="small"
        variant="outlined"
        placeholder="Search Company"
        value={companyNameQuery}
        onChange={(e) => setCompanyNameQuery(e.target.value)}
        sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: 1 }}
      />
      <Button variant="contained" color="secondary" onClick={fetchCompanyByName}>
        Search
      </Button> */}
    </Box>

    {/* Add Company Section */}
    {showAddCompany && (
      <Box className={styles.section}>
        <Company />
      </Box>
    )}

    {/* Add Company Owner Section */}
    {showAddCompanyOwner && (
      <Box className={styles.section}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Company</InputLabel>
          <Select
            labelId="company-label"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            onOpen={fetchCompanies}
            label="Company"
          >
            {companies.map((company) =>
              company && company.id ? (
                <MenuItem key={company.id.toString()} value={company.id.toString()}>
                  {company.name}
                </MenuItem>
              ) : null
            )}
          </Select>
        </FormControl>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Box sx={{ mt: 2 }}>
          <ButtonComponent text="Add Owner" onClick={handleAddCompanyOwner} />
        </Box>
      </Box>
    )}

    {/* Centered Table */}
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Box sx={{ width: '100%', maxWidth: '1000px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableSelectionOnClick
          sx={{
            minWidth: 1000, // or whatever is appropriate
            overflowX: 'auto',
          }}
        />
      </Box>
    </Box>
  </Container>
)}
      </Box>
    </Box>
  );
};

export default AdminPanel;
