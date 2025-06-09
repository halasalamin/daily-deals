import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: '1px solid #167f81',
  color: '#167f81',
  fontWeight: 600,
  width: 100,
  height: 40,
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: '#167f81',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#146f70',
    },
  },
}));

const UserTypeSelector = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(e, newValue) => newValue && onChange(newValue)}
      aria-label="user type"
      fullWidth
    >
      <StyledToggleButton value="customer">Customer</StyledToggleButton>
      <StyledToggleButton value="seller">Seller</StyledToggleButton>
    </ToggleButtonGroup>
  );
};

export default UserTypeSelector;
