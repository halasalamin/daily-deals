import React from "react";
import { Button } from "@mui/material";

const ButtonComponent = ({
  text,
  children,
  onClick,
  className = "",
  disabled = false,
  color = "primary",
  variant = "contained",
  fullWidth = false,
  type = "button",
  sx,
  icon,
  component,
  to,
}) => {
  return (
    <Button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      sx={sx}
      startIcon={icon}
      component={component}
      to={to}
    >
      {children || text}
    </Button>
  );
};

export default ButtonComponent;
