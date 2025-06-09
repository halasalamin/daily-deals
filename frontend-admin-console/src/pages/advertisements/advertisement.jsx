import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardContent, Typography, Button, TextField, Box, IconButton, Paper, InputAdornment, TablePagination, Chip, Popover,
  DialogTitle, DialogActions, Dialog, DialogContent, Tooltip
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import ImageIcon from '@mui/icons-material/Image';

import { DeleteIcon } from "../../icons";
import classes from './advertisement.module.css';


const baseUrl = "http://localhost:4000";
const rowsPerPageOptions = [10, 25, 100];

export default function GrantAdAccessPage() {
  const [ads, setAds] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const token = localStorage.getItem('token');
  const [page, setPage] = useState(0); // starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rejectReason, setRejectReason] = useState("");

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  useEffect(() => {
    fetchAllAds();
  }, []);

  const fetchAllAds = () => {
    axios.get(`${baseUrl}/api/ads`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        const allAdsData = res.data?.advertisements;
        setAds(Array.isArray(allAdsData) ? allAdsData : []);
      })
      .catch((err) => {
        console.error(err);
        setAds([]); // fallback to empty array on error
      });
  };
  const allRows = (ads || []).map((ad, index) => ({
    id: ad.id || index,
    name: ad.name,
    description: ad.description,
    owner: ad.owner?.username || '',
    email: ad.owner?.email || '',
    products: ad.products || [],
    imageUrl: ad.imageUrl,
    companyName: ad.companyName,
    startTime:new Date(ad.startTime).toLocaleString(),
    endTime: new Date(ad.endTime).toLocaleString(),
    rejectionReason: ad.status === 'rejected' ? ad.rejectionReason || '-' : '-',
    status: ad.status

  }));

  const paginatedRows = allRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const columns = [
     { field: 'companyName', headerName: 'Company', flex: 1, minWidth: 150, },
     { field: 'imageUrl', headerName: 'Preview', flex: 1, minWidth: 150,
     renderCell: (params) => (
           <Tooltip sx={{padding: 0, margin: 0}}
             title={
               <img
                 src={params.row.imageUrl}
                 alt={`ad-${params.row.companyName}`}
                 style={{ height: '100%', width: '100%', maxHeight: '500px', maxWidth: '700px', boxShadow: 4, borderRadius: '4px' }}
               />
             }
             // arrow
             placement="right"
             PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  p: 0, // remove all padding
                },
              },
            }}
           >
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
             <p style={{cursor: 'pointer'}}>Image</p>
             <IconButton size="small">
               <ImageIcon fontSize="small" />
             </IconButton>
            </div>
           </Tooltip>
       )

      },
     { field: 'startTime', headerName: 'Start Date', flex: 1, minWidth: 150, },
     { field: 'endTime', headerName: 'Etart Date', flex: 1, minWidth: 150, },
     {
       field: 'status',
       headerName: 'Status',
       flex: 1,
       minWidth: 150,
       maxWidth: 150,
       renderCell: (params) => {
         let color = 'default';
         if (params.value === 'approved') color = 'success';
         else if (params.value === 'rejected') color = 'error';
         else if (params.value === 'pending') color = 'warning';
         return <Chip label={params.value} color={color} />;
       }
     },
     {
       field: 'rejectionReason',
       headerName: 'Reject Reason',
       flex: 1,
       minWidth: 150,
       cellClassName: classes.ellipsisCell
     },
     {
       field: 'actions',
       headerName: 'Actions',
       width: 150,
       sortable: false,
       renderCell: (params) => (
      <>
        <IconButton onClick={() => handleAccept(params.row.id)} sx={{ fontSize: 20, color: '#80808080'}}>
          <CheckCircleIcon />
        </IconButton>
        <IconButton onClick={() => handleOpenReject(params.row)}  sx={{ fontSize: 20, color: '#80808080'}}>
          <CancelIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(params.row.id)}  sx={{ fontSize: 20, color: '#80808080'}}>
          <DeleteIcon style={{transform: 'scale(0.91)'}}/>
        </IconButton>
      </>
    )
     }
   ];

  const handleAccept = (id) => {
    axios.put(`${baseUrl}/api/admin/ads/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setAds((prev) => prev.filter(ad => ad.id !== id));
        fetchAllAds();
      })
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    const reason = rejectionReasons[id];
        console.log(">>>>", reason)
    if (!reason || reason.trim() === "") {
      alert("Please provide a reason for rejection.");
      return;
    }
    axios.put(`${baseUrl}/api/admin/ads/${id}/reject`, {
      rejectionReason: reason
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setAds((prev) => prev.filter(ad => ad.id !== id));
      setRejectDialogOpen(false);
      fetchAllAds();
    })
    .catch(err => console.error(err));
  };



    const handleReasonChange = (id, value) => {
    setRejectionReasons(prev => ({ ...prev, [id]: value }));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    axios.delete(`${baseUrl}/api/ads/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        // setAllAds((prev) => prev.filter(ad => ad._id !== id));
        setAds((prev) => prev.filter(ad => ad.id !== id));  // <-- Remove from pending ads too
      })
      .catch(err => console.error(err));
  };

  const handleOpenReject = (ad) => {
    setSelectedAd(ad);
    setRejectReason(""); // clear reason when opening
    setRejectDialogOpen(true);
  };
  return (
    <>
        <Paper elevation={0} className={classes.paperPadding} sx={{padding: '16px 36px 36px 36px', marginTop: '26px', display: 'flex'}}>
          {/* External Footer Pagination */}
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', marginTop: '8px', alignItems: 'center'}}>
          <TextField
             placeholder="Search by name"
             variant="outlined"
             size="small"
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
                    hideFooter
                    className={classes.gridContainer}
                  />
        </Paper>
        {rejectDialogOpen &&
          <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Reason for rejection"
                fullWidth
                value={rejectionReasons[selectedAd?.id] || ""}
                onChange={(e) => handleReasonChange(selectedAd?.id, e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleReject(selectedAd?.id)} color="error">Reject</Button>
            </DialogActions>
          </Dialog>
        }
    </>

  );
}
