import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
// import EditIcon from '@mui/icons-material/EditOutlined';
import { EditIcon, DeleteIcon } from "../../icons";

const initialAds = [
  {
    id: 1,
    company: 'Samsung',
    imageUrl: 'https://via.placeholder.com/120x60.png?text=Ad+1',
    start: '2025-05-23T20:21:00',
    end: '2025-05-30T20:16:00',
    status: 'pending'
  },
  // Add more mock ads here
];

export default function AdvertisementManager() {
  const [ads, setAds] = useState(initialAds);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editDates, setEditDates] = useState({ start: '', end: '' });

  const handleAccept = (ad) => {
    setAds((prev) =>
      prev.map((a) => (a.id === ad.id ? { ...a, status: 'approved' } : a))
    );
  };

  const handleOpenReject = (ad) => {
    setSelectedAd(ad);
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (selectedAd) {
      setAds((prev) =>
        prev.map((a) =>
          a.id === selectedAd.id ? { ...a, status: 'rejected', reason: rejectReason } : a
        )
      );
    }
    setRejectReason('');
    setRejectDialogOpen(false);
  };

  const handleOpenEdit = (ad) => {
    setSelectedAd(ad);
    setEditDates({ start: ad.start, end: ad.end });
    setEditDialogOpen(true);
  };

  const handleEdit = () => {
    setAds((prev) =>
      prev.map((a) =>
        a.id === selectedAd.id ? { ...a, start: editDates.start, end: editDates.end } : a
      )
    );
    setEditDialogOpen(false);
  };

  const columns = [
    { field: 'company', headerName: 'Company', width: 150 },
    {
      field: 'imageUrl',
      headerName: 'Preview',
      width: 130,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="ad"
          style={{ width: 100, height: 60, objectFit: 'cover' }}
        />
      )
    },
    {
      field: 'start',
      headerName: 'Start Date',
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'end',
      headerName: 'End Date',
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'approved') color = 'success';
        else if (params.value === 'rejected') color = 'error';
        else if (params.value === 'pending') color = 'warning';
        return <Chip label={params.value} color={color} />;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
     <>
       <IconButton onClick={() => handleAccept(params.row)} sx={{ fontSize: 20, color: '#80808080'}}>
         <CheckCircleIcon  sx={{ fontSize: 24 }}/>
       </IconButton>
       <IconButton onClick={() => handleOpenReject(params.row)}  sx={{ fontSize: 20, color: '#80808080'}}>
         <CancelIcon  sx={{ fontSize: 24 }} />
       </IconButton>
       <IconButton
         onClick={() => handleOpenEdit(params.row)}
         sx={{ fontSize: 20 }}
       >
         <EditIcon color={'gray'}/>
       </IconButton>
     </>
   )
    }
  ];

  return (
    <Box p={2} style={{ height: 500 }}>
      <h2>Advertising Requests</h2>
      <DataGrid
        rows={ads}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Advertisement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error">Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Advertisement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={editDates.start}
            onChange={(e) => setEditDates({ ...editDates, start: e.target.value })}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={editDates.end}
            onChange={(e) => setEditDates({ ...editDates, end: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
