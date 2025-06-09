import React from "react";
import { Button } from '@mui/material';
import styles from './ButtonComponent.module.css';
import clsx from "clsx";

const ButtonComponent = ({
  text,
  children,
  onClick,
  className = "",
  disabled = false,
  color = "primary",
  variant = "contained",
  fullWidth = false,
  type = 'button',
  sx,
  icon,
  capitalize = false,
  iconClassName = '',
}) => {

  const buttonClass = clsx(
    styles.button,
    variant === 'outlined' ? styles.outlined : styles.contained,
    capitalize ? styles.capitalize : '',
    className // <- this allows user-passed className to override or extend styles
  );

  return (
    <Button
      className={buttonClass}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      type={type}
      disabled={disabled}
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      sx={sx}
    >

      {icon && <span className={clsx(styles.iconWrapper, iconClassName)}>{icon}</span>}
      {children || text}
    </Button>
  );
};

export default ButtonComponent;
