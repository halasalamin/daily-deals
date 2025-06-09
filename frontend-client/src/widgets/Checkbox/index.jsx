import { Checkbox, FormControlLabel } from '@mui/material';
import classes from './checkbox.module.css';
import clsx from 'clsx';

const CustomCheckbox = ({ label, ...props }) => {
  const checkbox = (
    <Checkbox
      {...props}
      className={classes.root}
      icon={<span className={classes.icon}></span>}
      checkedIcon={
        <span className={clsx(classes.icon, classes.checked)}>✔</span>
      }
    />
  );

  return label ? (
    <FormControlLabel control={checkbox} label={label}  className={classes.label}/>
  ) : (
    checkbox
  );
};

export default CustomCheckbox;
