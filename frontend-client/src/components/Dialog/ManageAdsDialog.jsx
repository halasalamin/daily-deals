import React, { useState, useRef } from "react";
import { TextField, Typography, Snackbar, Alert, Box, Dialog} from "@mui/material";
import axios from "axios";
import ButtonComponent from "../../widgets/ButtonComponent";

const ManageAdDialog = ({ open, onClose, onAdSubmitted }) => {
  const [image, setImage] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  // const handleImageUpload = () => {}
  const handleCancel = () => {}
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
  } else {
    setImage(null)
  }

}

  const handleSubmit = async () => {
    if (!image || !startTime || !endTime) {
      setStatusMessage("Please upload an image and select start and end date.");
      setSnackbarOpen(true);
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setStatusMessage("End time must be after start time.");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/ads", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const adStatus = res.data.status || "pending";
      setStatusMessage(`Your ad has been submitted and is now "${adStatus}".`);
      setSnackbarOpen(true);
      setTimeout(() => {
        setImage(null);
        setStartTime("");
        setEndTime("");
        if (onAdSubmitted) onAdSubmitted();
        onClose();
      }, 3000);
    } catch (error) {
      setStatusMessage("Error submitting ad.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
      <Box
        sx={{
          minWidth: 450,
          minHeight: 600,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'space-between'
        }}
      >
      <div style={{display: 'flex', flexFlow: 'column nowrap', gap: '24px', alignItems: 'center'}}>
      <Typography variant="h6" fontWeight="bold">
        Submit New Advertisement
      </Typography>
      <TextField
        label="Start Time"
        type="datetime-local"
        fullWidth
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Time"
        type="datetime-local"
        fullWidth
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <ButtonComponent
        text={"📁 Upload Image"}
        onClick={() => fileInputRef.current?.click()}
        variant="outlined"
        capitalize
        sx={{width:"100%"}}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      {/* Thumbnail Preview */}
      {image && (
        <Box
          sx={{
            mt: 1,
            maxWidth: '400px',
            maxHeight: 160,
            overflow: 'hidden',
            borderRadius: 1,
            border: '1px solid #ccc',
          }}
        >
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={{
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <ButtonComponent
            text={"Cancel"}
            onClick={onClose}
            sx={{width:"150px"}}
            variant="outlined"
            capitalize
          />
          <ButtonComponent
            text={"Submit"}
            onClick={handleSubmit}
            sx={{width:"150px"}}
            capitalize
          />
      </Box>
      </Box>
      {console.log("halala")}
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
          {statusMessage}
        </Alert>
      </Snackbar>
      </>
  );
};

export default ManageAdDialog;
