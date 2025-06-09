import React, { useState } from "react";
import {
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // TextField,
  Typography,
  InputAdornment,
  IconButton,
  Collapse,
  Alert,
  Stack,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import LocalShipping from "@mui/icons-material/LocalShipping";
import AttachMoney from "@mui/icons-material/AttachMoney";
import LocationOn from "@mui/icons-material/LocationOn";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import MailIcon from "@mui/icons-material/MailOutlined";
import Dialog from '../../widgets/Dialog';
import TextField from '../../widgets/TextField';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const AccountInfoDialog = ({
  isOpen,
  onClose,
  type,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isUsernameValid = (name) => name.trim().length >= 4;

  const isPasswordValid = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pw);
  };

  const handleSave = async () => {
  if (email && !validateEmail(email)) {
    setMessage("Please enter a valid email address");
    return;
  }

  setIsSaving(true);
  setMessage("");

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      "http://localhost:4000/api/user/update-profile",
      {
        username,
        email,
        ...(password && { password }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    setMessage(
      err.response?.data?.message || "Failed to save changes. Please try again."
    );
  } finally {
    setIsSaving(false);
  }
};


  const renderAccountContent = () => (
    <Stack
      sx={{
        p: 3,
        // bgcolor: 'background.paper',
        // borderRadius: 2,
        // boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        // backgroundImage: 'linear-gradient(to bottom right, #f8f9fa, #ffffff)'
        padding: '0 10px',
      }}
    >

      <Stack spacing={2} sx={{ mt: 2 }}>
        <p style={{width: 'fit-content', marginBottom: '-14px', marginTop: 0, fontSize: '12px',
    // color: '#0c4647',
    color: '#167f81'}}>Username</p>
       <TextField
          placeholder="Full Name"
          variant="outlined"
          fullWidth
          startIcon={<BadgeOutlinedIcon style={{color: '#0000008a'}} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={username !== "" && !isUsernameValid(username)}
          helperText={
            username !== "" && !isUsernameValid(username)
              ? "Username must be at least 4 characters"
              : ""
          }
        />

        <p style={{width: 'fit-content', marginBottom: '-14px', marginTop: 0, fontSize: '12px',
    // color: '#0c4647',
    color: '#167f81'}}>Email</p>
        <TextField
          placeholder="Email"
          variant="standard"
          fullWidth
          type="email"
          error={email !== "" && !validateEmail(email)}
          startIcon={<MailIcon style={{color: '#0000008a'}}/>}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

          <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: 0}}
          onClick={() => setShowPassword(!showPassword)}>
            <p style={{fontWeight: 600, marginRight: '20px', fontSize: '12px',
        // color: '#0c4647',
        color: '#167f81'}}>Change Password</p>
            <ChevronRightOutlinedIcon style={{color: '#5e5a5a8a', fontSize: '23px'}} />
          </div>
      { showPassword && <TextField
          label="New Password"
          variant="filled"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password !== "" && !isPasswordValid(password)}
          helperText={
            password !== "" && !isPasswordValid(password)
              ? "Password must be 8+ chars, include uppercase, lowercase, number, and special char"
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        }
        <Collapse in={!!message}>
          <Alert
            severity={message.includes("successfully") ? "success" : "error"}
            icon={message.includes("successfully") ? <CheckCircle /> : <ErrorIcon />}
            sx={{
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {message}
          </Alert>
        </Collapse>
      </Stack>
    </Stack>
  );

  const renderPaymentContent = () => (
    <div style={{minWidth: '500px', display: 'flex'}}>
    <Stack
      spacing={2}
      sx={{
        p: 3,
        // borderRadius: 2,
        // bgcolor: '#f8f9fa',
        // border: '1px solid #e0e0e0',
        // boxShadow: '0px 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <AttachMoney sx={{ color: '#167f81', fontSize: 28, marginLeft: "-7px" }} />
        <Typography variant="h6" sx={{ color: '#2d3436', fontWeight: 600 }}>
          Payment Method
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{
        color: '#4a4a4a',
        pl: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <strong style={{ color: '#167f81' }}>Cash on Delivery</strong>
        <Tooltip title="Includes delivery fee in pricing">
          <InfoOutlined sx={{ color: '#757575', fontSize: 16 }} />
        </Tooltip>
      </Typography>

      <Divider sx={{ borderColor: '#e0e0e0' }} />

      <Stack direction="row" alignItems="center" spacing={1.5} pt={1}>
        <LocalShipping sx={{ color: '#d84315', fontSize: 28 }} />
        <Typography variant="h6" sx={{ color: '#2d3436', fontWeight: 600 }}>
          Delivery Rates
        </Typography>
      </Stack>

      <Stack spacing={2} pl={2}>
        {[
          { area: 'Occupied territories', price: '₪70', color: '#c62828' },
          { area: 'West Bank', price: '₪20', color: '#2e7d32' },
          { area: 'Jerusalem', price: '₪30', color: '#1565c0' }
        ].map((item) => (
          <Stack
            key={item.area}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              p: 1.5,
              borderRadius: 1,
              transition: '0.3s',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.03)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <LocationOn sx={{ color: item.color }} />
            <Typography variant="body1" sx={{ flexGrow: 1, color: '#424242' }}>
              {item.area}
            </Typography>
            <Chip
              label={item.price}
              sx={{
                fontWeight: 700,
                bgcolor: `${item.color}10`,
                color: item.color
              }}
            />
          </Stack>
        ))}
      </Stack>

      <Typography variant="caption" sx={{
        color: '#757575',
        mt: 1,
        display: 'block',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        * Delivery times may vary based on location
      </Typography>
    </Stack>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      onCancel={type === "payment" ? null : onClose}
      onSubmit={type === "payment" ? null : handleSave}
      title={type === "payment" ? "Payment & Delivery" : "Account Settings"}
      submitBtnDisabled={isSaving}
    >
      {type === "payment" ? renderPaymentContent() : renderAccountContent()}

    </Dialog>
  );
};

export default AccountInfoDialog;
