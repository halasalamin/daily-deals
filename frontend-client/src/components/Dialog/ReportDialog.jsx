import React, { useState } from 'react';
import {
  Button,
  TextField
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Dialog from "../../widgets/Dialog"

const ReportDialog = ({ open, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (text.trim() === '') {
      setError(true);
      return;
    }
    setError(false);
    onSubmit(text);
    setText('');
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim() !== '') {
      setError(false);
    }
  };

  return (
    <Dialog
      open={open}
      title={"Report a problem"}
      onSubmit={handleSubmit}
      onClose={onClose}
      onCancel={onClose}
    >
      <div style={{minWidth: '600px'}}>
      <TextField
        autoFocus
        margin="dense"
        label="Report Details"
        type="text"
        fullWidth
        multiline
        rows={10}
        variant="outlined"
        value={text}
        onChange={handleChange}
        error={error}
        helperText={error ? "Please enter a report detail." : ""}
      />
      </div>
    </Dialog>
  );
};

export default ReportDialog;
