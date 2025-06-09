import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgb(22 127 129 / 70%)',
      }}
    >
      <CircularProgress size={60} thickness={5} sx={{color: '#efeff2'}} />
      <p style={{color: 'white', marginTop: '45px', fontSize: '18px', fontWeight: 500}}>
        Loading, please wait...
      </p>
    </Box>
  );
};

export default LoadingScreen;
