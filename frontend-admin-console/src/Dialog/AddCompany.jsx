import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GeneralDialog from '../widgets/Dialog';

const AddCompanyDialog = ({ open, onClose, fetchCompanies, token }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    // submit logic, call API with token
    try {
      await axios.post('http://localhost:4000/api/admin', {
        companyName,
        description: companyDescription,
        username,
        email,
        password
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();  // refresh company list
      onClose();        // close dialog
    } catch (err) {
      // handle error
    }
  };

  return (
       <GeneralDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitText="Create"
      cancelText="Cancel"
      submitBtnWidth="120px"
      cancelBtnWidth="120px"
      submitClassName=""
      cancelClassName=""
      title="Add New Company"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '500px', padding: '10px 0' }}>
        <TextField
          label="Company Name"
          fullWidth
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <TextField
          label="Company Description"
          fullWidth
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
        />
        <TextField
          label="Owner Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          name={"input_email" + Math.random().toString(36).substring(2, 15)} //  prevent browser autocomplete

          autoComplete="off" //  prevents autocomplete
          inputProps={{
            autoComplete: 'new-password',
            form: 'disable-autofill-form', //  workaround
            style: { fontSize: 16, outline: 'none', border: 'none' }
          }}
          label="Owner Email"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name={"input_password" + Math.random().toString(36).substring(2, 15)} //  prevent browser autocomplete

          autoComplete="off" //  prevents autocomplete
          inputProps={{
            autoComplete: 'new-password',
            form: 'disable-autofill-form', //  workaround
            style: { fontSize: 16, outline: 'none', border: 'none' }
          }}
          label="Owner Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      {/* <DialogActions>
        <Button onClick={onClose} sx={{color:"#009688", border:"1px solid #009688", borderRadius:"4px"}}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{backgroundColor:"#009688", fontWeight:"bolder"}}>Create</Button>
      </DialogActions> */}
      </div>
    </GeneralDialog>
  );
};

export default AddCompanyDialog;
