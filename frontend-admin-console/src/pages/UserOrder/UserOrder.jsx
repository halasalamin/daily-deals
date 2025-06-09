import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, TablePagination,
  Select, MenuItem, Tooltip, Box, TextField, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


import { DataGrid } from '@mui/x-data-grid';
import classes from './orders.module.css';

const rowsPerPageOptions = [10, 25, 100];
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return '#f0ad4e'; // yellow
    case 'Processing':
      return '#5bc0de'; // blue
    case 'Shipped':
      return '#0275d8'; // darker blue
    case 'Delivered':
      return '#5cb85c'; // green
    case 'Cancelled':
      return '#d9534f'; // red
    default:
      return '#ccc'; // default gray
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0); // starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/order/list', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const readyOrders = res.data.data;
    setOrders(readyOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

const columns = [
   { field: 'referenceId', headerName: 'Refernce ID', flex: 1, minWidth: 150, },
   { field: 'date', headerName: 'Date', flex: 1, minWidth: 150, maxWidth: 150, },
   { field: 'username', headerName: 'username', flex: 1, minWidth: 150, },
   { field: 'address', headerName: 'Address', flex: 1, minWidth: 150, },
   {
     field: 'phone',
     headerName: 'Phone Number',
     flex: 1,
     minWidth: 150,
     maxWidth: 150,
   },
   {
     field: 'items',
     headerName: 'Items',
     flex: 1,
     minWidth: 150,
     maxWidth: 150,
     headerClassName: classes.cellCenter,
     renderCell: (params) => (
       <Box
      sx={{
        width: '50px',
        maxWidth: '50px',
        display: 'flex',
        alignItems: 'center', // vertical centering
        justifyContent: 'center', // horizontal centering
        // width: '100%',
        // height: '100%',
      }}
    >
      <Tooltip
        title={
          <Box>
            {params.row.items.map((item, index) => (
              <div key={index}>{item.name}</div>
            ))}
          </Box>
        }
        arrow
        placement="top"
      >
        <span style={{ cursor: 'pointer' }}>{params.row.items.length}</span>
      </Tooltip>
      </Box>
    )
   },
   {
     field: 'total',
     headerName: 'Total',
     flex: 1,
     minWidth: 150,
     maxWidth: 150
   },
   {
     field: 'status',
     headerName: 'Status',
     flex: 1,
     minWidth: 150,
     maxWidth: 150,
     renderCell: (params) => (
       <Box
     sx={{
       display: 'flex',
       alignItems: 'center',  // vertical centering
       height: '100%',
       width: '100%',
     }}
   >
       <Select
      value={params.value}
      onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
      size="small"
      variant="outlined"
      sx={{
         height: 36,
         minWidth: 140,
         fontSize: 13,
         paddingY: 0,
         '.MuiSelect-select': {
           display: 'flex',
           alignItems: 'center',
         },
       }}
      renderValue={(value) => (
        <Box display="flex" alignItems="center" gap={1}>
          <FiberManualRecordIcon
            fontSize="small"
            sx={{ color: getStatusColor(value) }}
          />
          <span>{value}</span>
        </Box>
      )}
    >
     {['Pending', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map(
       (status) => (
         <MenuItem key={status} value={status} disabled={status === 'Ready'}>
           <Box display="flex" alignItems="center" gap={1}>
             <FiberManualRecordIcon
               fontSize="small"
               sx={{ color: getStatusColor(status) }}
             />
             <span>{status}</span>
           </Box>
         </MenuItem>
       )
     )}
   </Select>
   </Box>
 ),
   }

 ];

  const allRows = (orders || []).map((order, index) => ({
    id: order.id || index,
    referenceId: order.referenceId ?? '-' ,
    date: new Date(order.date).toLocaleDateString(),
    username: order.address?.fullName || 'Unknown',
    address: order.address?.city + '_' + order.address?.street,
    phone: order.address?.phone,
    total: '₪' + order.amount?.toFixed(2),
    status: order.status,
    numberOfItems: order.items?.length || 0,
    items: order.items
  }));

  const filteredRows = allRows.filter(row =>
    row.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/order/${orderId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <Paper elevation={0} className={classes.paperPadding} sx={{padding: '16px 36px 36px 36px', marginTop: '26px', display: 'flex'}}>
      {/* External Footer Pagination */}
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', marginTop: '8px', alignItems: 'center'}}>
      <TextField
         placeholder="Search by reference ID"
         variant="outlined"
         size="small"
         onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
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
        rows={paginatedRows}
        columns={columns}
        disableSelectionOnClick
        disableRowSelectionOnClick
        hideFooter
        className={classes.gridContainer}
      />
    </Paper>
  );
};

export default AdminOrdersPage;
