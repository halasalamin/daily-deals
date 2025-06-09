import React from "react";
import Box from '@mui/material/Box';
import { Container, Typography, TextField } from '@mui/material';
import ButtonComponent from "../../components/ButtonComponent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MailIcon from '@mui/icons-material/Mail';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// const backgroundColor = 'linear-gradient(90deg, #1bb8c2 0%, #149ca4 100%)';
const backgroundColor = '#149ca4';

const Signin = ({ setUserData }) => {
//.data && response.data.token && response.data.user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:4000/api/admin/login', { email, password });

      if (response) {
        setUserData(response.data.data, response.data.token);

      navigate("/");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm" sx={{minWidth: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'}}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          py: 4,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: { xs: 3, sm: 4 },
            paddingBottom: '50px !important',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
            width: '100%',
            maxWidth: '440px',
          }}
        >
          {/* Add Logo */}
          <div style={{display: 'flex', flexFlow: 'column nowrap', height: '210px'}}>
          <p
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '20px'
            }}
          >
            Admin Portal
          </p>
            <img src='DailyDeals.png' alt="Company Logo" style={{transform: 'scale(0.2)', borderRadius: '23px',
            marginTop: '-166px'}}/>
          </div>



          <form onSubmit={onSubmit} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MailIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                my: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: '#3f51b5' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                    boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                  },
                }
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#5f6368' }}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                my: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: '#3f51b5' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                    boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                  },
                }
              }}
            />

            {error && (
              <Typography
                color="error"
                sx={{
                  mt: 1,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {error}
              </Typography>
            )}

            <ButtonComponent
              type="submit"
              text="SIGN IN"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '8px',
                background: backgroundColor,
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            />
          </form>
        </Box>
      </Box>
    </Container>
  );
}

export default Signin;
