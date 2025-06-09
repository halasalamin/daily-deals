import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  InputAdornment,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import GeneralDialog from "../../widgets/Dialog";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailIcon from "@mui/icons-material/MailOutlined";
import TextField from '../../widgets/TextField';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const CompanySettingsDialog = ({ open, onClose, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const isPasswordValid = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pw);
  };

  const handlePasswordChange = async () => {
    try {
    //   const response = await axios.put(
    //     `http://localhost:4000/api/company/change-password/${userId}`,
    //     { newPassword },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   if (response.data.success) {
    //     alert("Password updated successfully.");
    //     setShowPasswordField(false);
    //     setNewPassword("");
    //   } else {
    //     alert("Failed to update password.");
    //   }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while changing the password.");
    }
  };

useEffect(() => {
  console.log("company prop:", user);
}, [user]);


  return (
    <GeneralDialog
      open={open}
      title="Company Settings"
      onClose={onClose}
      onCancel={onClose}
      onSubmit={handlePasswordChange}
      submitText="Save Password"
      cancelText="Close"
      submitBtnDisabled={!password}
    >

    <Stack
      sx={{
        p: 3,
        padding: '0 10px',
      }}
    >

      <Stack spacing={2} sx={{ mt: 2 }}>
        <p style={{width: 'fit-content', marginBottom: '-14px', marginTop: 0, fontSize: '12px',
    color: '#167f81'}}>Username</p>
       <TextField
          placeholder="Full Name"
          variant="outlined"
          fullWidth
          startIcon={<BadgeOutlinedIcon style={{color: '#0000008a'}} />}
          value={user?.username}
          disabled={true}
        />

        <p style={{width: 'fit-content', marginBottom: '-14px', marginTop: 0, fontSize: '12px',
    color: '#167f81'}}>Email</p>
        <TextField
          placeholder="Email"
          variant="standard"
          fullWidth
          type="email"
          startIcon={<MailIcon style={{color: '#0000008a'}}/>}
          value={user?.email}
          disabled={true}
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
      </Stack>
    </Stack>

    </GeneralDialog>
  );
};

export default CompanySettingsDialog;
