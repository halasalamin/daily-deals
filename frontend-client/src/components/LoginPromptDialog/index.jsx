import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '../../widgets/ButtonComponent';
import { useNavigate } from 'react-router-dom';

const LoginPromptDialog = ({ onClose, title = 'Please log in to access this feature'}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

//  'Please log in to add items to your cart.'
// Please log in to access this feature.
  return (
    <Dialog
      open={true}
      onClose={onClose}
    >
      <p style={{margin: '25px 0', fontWeight: 500, fontSize: "18px", width: '400px'}}>{title}</p>
      <DialogActions sx={{padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button variant="outlined" onClick={onClose} capitalize>Cancel</Button>
        <Button onClick={() => navigate('/login')} capitalize>Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPromptDialog;
