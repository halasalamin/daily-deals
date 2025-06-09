import React from 'react';
import Button from '../../widgets/ButtonComponent';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Button,
  Typography,
  Stack,
  IconButton,
  Box
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from '@mui/icons-material/Close';


function ContactDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: 400, borderRadius: 2, paddingBottom: '24px' } }}>
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '30px 12px 24px 24px'}}>
      <p style={{fontWeight: 600, fontSize: '18px'}}>Contact us</p>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>
        <Stack spacing={2} sx={{width: '500px', padding: '0 24px'}}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PhoneIcon sx={{color: '#167f81'}} />
            <Typography variant="body1">
              <strong>Admin:</strong> +970 599 123 456
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{color: "#167f81"}} />
            <Typography variant="body1"><strong>Admin:</strong> admin@dailyDeals.com</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{color: "#167f81"}} />
            <Typography variant="body1">
              <strong>Developer:</strong> 211159@ppu.edu.ps
            </Typography>
          </Stack>
        </Stack>

        <Button onClick={onClose} sx={{width: '200px', alignSelf: 'end', marginRight: '24px', marginTop: '24px'}}>
          OK
        </Button>
    </Dialog>
  );
}

export default ContactDialog;
