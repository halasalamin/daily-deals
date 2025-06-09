import React, { useState, useEffect } from 'react';
import {
   DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress
} from '@mui/material';
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import {Snackbar, Alert} from '@mui/material';
import Dialog from '../widgets/Dialog';


const EditCompanyDialog = ({ open, onClose, company }) => {
  const { updateCompanyOrOwner } = useDashboardLogic();

  const [localName, setLocalName] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const showSnackbar = (message, severity = 'info') => {
  setSnackbar({ open: true, message, severity });
};

const handleSnackbarClose = () => {
  setSnackbar({ ...snackbar, open: false });
};

  // Initialize local state when dialog opens
  useEffect(() => {
    if (open && company) {
      setLocalName(company.name || '');
      setLocalDescription(company.description || '');
      setLocalEmail(company.email || '');
      setLocalUsername(company.owner || '');
      setLocalPassword('');
    }
  }, [open, company]);

  const handleSubmit = async () => {

    setUsernameError('');
    setEmailError('');

    const companyId = company.id;
    const data = { companyId };

    if (localName.trim() && localName !== company.name) {
      data.name = localName;
    }
    if (localDescription.trim() && localDescription !== company.description) {
      data.description = localDescription;
    }
    if (localUsername.trim() && localUsername !== company.username) {
      data.username = localUsername;
    }
    if (localEmail.trim() && localEmail !== company.email) {
      data.email = localEmail;
    }

    if (localPassword.trim()) {
      data.password = localPassword;
    }
    console.log("local password", localPassword)

    if (Object.keys(data).length === 1) {
      // Only companyId exists — no changes were made
      showSnackbar('Please change at least one field before saving.', 'warning');
      return;
    }

    setLoading(true);
    const result = await updateCompanyOrOwner(data);
    setLoading(false);

    if (result.success) {
      onClose();
    } else{
        if (result.message?.toLowerCase().includes('username')) {
              setUsernameError(result.message);
            } else if (result.message?.toLowerCase().includes('email')) {
              setEmailError(result.message);
            } else {
              showSnackbar(result.message || 'Something went wrong.', 'error');
            }
          }
};


  return (
    <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    title="Edit Company and Owner"
    onSubmit={handleSubmit}
    onCancel={onClose}
    submitText={loading ? <><CircularProgress size={24} /> Submit</> : 'Submit'}
    submitBtnDisabled={loading}
    cancelBtnDisabled={loading}
    >
      <div style={{width: '500px', minWidth: '500px'}}>
        <TextField
          margin="normal"
          label="Company Name"
          fullWidth
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Company Description"
          fullWidth
          multiline
          rows={3}
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Owner Username"
          fullWidth
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          margin="normal"
          label="Owner Email"
          type="email"
          fullWidth
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          name={"input_" + Math.random().toString(36).substring(2, 15)}
          autoComplete="off" //  prevents autocomplete
          inputProps={{
            autoComplete: 'new-password',
            form: 'disable-autofill-form', //  workaround
            style: { fontSize: 16, outline: 'none', border: 'none' }
          }}
          margin="normal"
          label="New Password (Optional)"
          type="password"
          fullWidth
          value={localPassword}
          onChange={(e) => setLocalPassword(e.target.value)}
        />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </div>
    </Dialog>
  );
};

export default EditCompanyDialog;
