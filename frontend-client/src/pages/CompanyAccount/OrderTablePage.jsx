import React, { useState } from "react";
import { Box, Typography, Tooltip, Paper, TextField, InputAdornment, TablePagination, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import classes from "./products.module.css"
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const rowsPerPageOptions = [10, 25, 100];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#f0ad4e';
    case 'Processing': return '#5bc0de';
    case 'Shipped': return '#0275d8';
    case 'Delivered': return '#5cb85c';
    case 'Cancelled': return '#d9534f';
    default: return '#ccc';
  }
};

const OrdersPage = ({ recentOrders = [], updateOrderStatus }) => {
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const columns = [
    { field: 'orderNumber', headerName: 'Order Number', flex: 1, minWidth: 150 },
    { field: 'date', headerName: 'Date of Order', flex: 1, minWidth: 150 },
    { field: 'total', headerName: 'Total Amount', flex: 1, minWidth: 150 },
    {
      field: 'itemsCount',
      headerName: 'Items',
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      renderCell: (params) => {
        const items = params.row.itemDetails;
        const tooltipContent = (
          <Box>
            {items.map((item, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: 1,
                    border: '1px solid #ccc'
                  }}
                />
                <Typography variant="body2">
                  {item.name} - Qty: {item.quantity}
                </Typography>
              </Box>
            ))}
          </Box>
        );


        return (
          <Tooltip title={<pre>{tooltipContent}</pre>} arrow placement="top">
            <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {items.length} item{items.length > 1 ? 's' : ''}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
          <Select
            value={params.row.status}
            onChange={(e) => {
              e.stopPropagation();
              updateOrderStatus(params.row.id, e.target.value);
            }}
            size="small"
            variant="outlined"
            sx={{
              height: 36,
              minWidth: 140,
              fontSize: 13,
              paddingY: 0,
              '.MuiSelect-select': { display: 'flex', alignItems: 'center' },
            }}
            renderValue={(value) => (
              <Box display="flex" alignItems="center" gap={1}>
                <FiberManualRecordIcon fontSize="small" sx={{ color: getStatusColor(value) }} />
                <span>{value}</span>
              </Box>
            )}
          >
            {['Pending', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map(
              (status) => (
                <MenuItem key={status} value={status} disabled={status !== 'Pending' && status !== 'Ready'}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FiberManualRecordIcon fontSize="small" sx={{ color: getStatusColor(status) }} />
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

  
  const allRows = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.referenceId ?? '-',
    date: new Date(order.date).toLocaleDateString(),
    total: order.amount,
    itemsCount: order.items.length,
    status: order.status,
    itemDetails: order.items,
  }));


  const filteredRows = allRows.filter(row =>
    row.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper elevation={0} className={classes.paperPadding} sx={{ marginTop: '24px', padding: '16px 36px 36px 36px', display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', marginTop: '8px', alignItems: 'center' }}>
          <TextField
            placeholder="Search by reference"
            variant="outlined"
            size="small"
            sx={{
              width: '300px',
              height: '40px',
              '& .MuiInputBase-root': { height: '40px' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); 
            }}
          />
          <TablePagination
            sx={{
              minHeight: '38px !important',
              maxHeight: '38px !important',
              '& .MuiTablePagination-toolbar': {
                maxHeight: '36px !important',
                minHeight: '36px !important'
              }
            }}
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredRows.length}
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
          disableSelectionOnClick
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default OrdersPage;
