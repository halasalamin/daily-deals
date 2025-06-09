import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useDashboardLogic } from '../../hooks/useDashboardLogic';

const Company = () => {

  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const logoutAndRedirect = (msg) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert(msg);
    window.location.href = '/admin-login';
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user || JSON.parse(user).role !== 'admin') {
        logoutAndRedirect('You must be logged in as admin to access this page.');
      }
    } catch (err) {
      logoutAndRedirect('Session error, please login again.');
    }
  }, []);

  // const handleSubmit = async () => {
  //   if (!companyName || !companyDescription || !username || !email || !password) {
  //     setError('All fields are required');
  //     return;
  //   }

  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     logoutAndRedirect('Session expired. Please login again.');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:4000/api/admin',
  //       {
  //         companyName,
  //         description: companyDescription,
  //         username,
  //         email,
  //         password,
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert('Company and owner created successfully');

  //     // Reset form
  //     setCompanyName('');
  //     setCompanyDescription('');
  //     setUsername('');
  //     setEmail('');
  //     setPassword('');
  //     setError('');
  //   } catch (error) {
  //     if (error.response?.status === 401 || error.response?.status === 403) {
  //       logoutAndRedirect('Session expired. Please login again.');
  //     } else {
  //       console.error('Error creating company:', error.response?.data || error.message);
  //       alert(error.response?.data?.message || 'Failed to create company and owner.');
  //     }
  //   }
  // };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h5" align="center">Create a New Company</Typography>

        {error && <Typography color="error" align="center">{error}</Typography>}

        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Company Description"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Owner Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Owner Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Owner Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Button variant="contained" color="primary" > 
        {/* onClick={handleSubmit} */}
          Create Company
        </Button>
      </Box>
    </Container>
  );
};

export default Company;