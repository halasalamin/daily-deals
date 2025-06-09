import { InputBase } from '@mui/material';
import classes from './textField.module.css';
import {useState} from 'react';

const TextField = (props) => {
  const { startIcon, endIcon, error, helperText, ...restProps } = props;
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const borderColor = error
   ? '#f44336' // Material-UI red for error
   : focused
   ? '#167f81'
   : '#ccc';

  return (
    <div style={{position: 'relative'}}>
      <div
        className={classes.fieldContainer}
        style={{borderBottom: focused ? `2px solid ${borderColor}` : 'none'}}
      >
          {props.startIcon}
          <span style={{marginRight: 8}}></span>
          <InputBase
            onFocus={onFocus}
            onBlur={onBlur}
            fullWidth
            classes={{
              root: classes.inputRoot,
              input: classes.inputElement,
            }}
            name={"input_" + Math.random().toString(36).substring(2, 15)} //  prevent browser autocomplete

            autoComplete="off" //  prevents autocomplete
            inputProps={{
              autoComplete: 'new-password',
              form: 'disable-autofill-form', //  workaround
              style: { fontSize: 16, outline: 'none', border: 'none' }
            }}
            {...restProps}
          />
          {props.endIcon}
        </div>
        {error && (
          <span className={classes.helperText}>
            {helperText}
          </span>
        )}
      </div>
  );
};

export default TextField;
