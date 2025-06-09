import classes from './dialog.module.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../../components/ButtonComponent';

const GeneralDialog = ({
  open,
  title,
  children,
  onClose,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  submitBtnDisabled,
  cancelBtnDisabled,
  submitClassName,
  cancelClassName,
  submitBtnWidth,
  cancelBtnWidth,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
      scroll="paper"
    >
      <div className={classes.header}>
        <p className={classes.title}>{title}</p>
        <IconButton onClick={onClose} className={classes.closeBtn}>
          <CloseIcon />
        </IconButton>
      </div>

      <div dividers className={classes.content}>
        {children}
      </div>

      <div className={classes.actions}>
        {onCancel && <Button
          text={cancelText} // ?? loading you can add loader as icon or something
          onClick={onCancel}
          disabled={cancelBtnDisabled}
          sx={{ color:"#009688", minWidth: "120px", marginRight: onSubmit ? '20px' : 0}}
          className={cancelClassName}
          capitalize
          variant="outlined"
        />}
        {onSubmit && <Button
          text={submitText}
          onClick={onSubmit}
          disabled={submitBtnDisabled}
          sx={{ backgroundColor:"#009688", minWidth: "120px", width: submitBtnWidth || 'auto' }}
          className={submitClassName}
          capitalize
        />}
      </div>
    </Dialog>
  );
};

export default GeneralDialog;
