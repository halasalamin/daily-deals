import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Stack,
  DialogActions
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import axios from "axios";

import GeneralDialog from "../../widgets/Dialog";

const formatFullDate = (dateStr) => {
  const options = {
    year: 'numeric',
    month: 'long',  // full month name like "May"
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Date(dateStr).toLocaleString(undefined, options);
};

const AdStatusDialog = ({ open, onClose }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      fetchAds();
    }
  }, [open]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/ads/my-ads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(res.data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <GeneralDialog
      open={open}
      onClose={onClose}
      title="My Advertisement Status"
      onCancel={onClose}
      cancelText="Close"
    >
      <div style={{minWidth: '752px'}}>
      {loading ? (
        <CircularProgress />
      ) : ads.length === 0 ? (
        <Typography>No ads submitted yet.</Typography>
      ) : (
        <List>
          {ads.map((ad) => (
          <ListItem
            key={ad._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 4, // spacing between items
              borderBottom: '1px solid #b6babe33',
              marginBottom: '10px'
            }}
          >
          <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'start'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" fontWeight="500" style={{marginRight: '10px'}}>
              Duration:
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{marginRight: '40px'}}>
              From <strong>{formatFullDate(ad.startTime)}</strong> to <strong>{formatFullDate(ad.endTime)}</strong>
            </Typography>
            <Button
            variant="outlined"
            onClick={() => window.open(ad.imageUrl, '_blank')}
            sx={{ textTransform: 'none', alignSelf: 'flex-start', border: 'none' }}
            >
            📷 View Image
            </Button>
          </div>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#888888e6',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              Status: {ad.status}
              {ad.status === 'rejected' && ad.rejectionReason
                ? `, Reason: ${ad.rejectionReason}`
                : ''}
            </Typography>
          </Box>
          </div>
          </ListItem>
          ))}
        </List>
      )}
      </div>
    </GeneralDialog>
</>
  );
};

export default AdStatusDialog;
