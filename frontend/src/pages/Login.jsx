import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, TextField, Button, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../helper/getLinks';

import ErrorModal from '../components/ErrorModal';

// Landing page as "All listings page"
export default function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState('');

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();

  const handleCancel = () => navigate('/');

  const handleLogin = async () => {
    try {
      const loginResponse = await fetch(`${BACKEND_URL}/user/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email, password
        }),
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        props.setToken(data.token);
        navigate('/');
        localStorage.setItem('userEmail', email);
      } else {
        setModalMsg(data.error || 'An error occurred during login.');
        setModalShow(true);
      }
    } catch (error) {
      setModalMsg(error.toString());
      setModalShow(true);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '60vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center'
      }}
      noValidate
      autoComplete="off"
    >
      <ErrorModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        msg={modalMsg}
      />
      <Typography variant="h4" sx={{ textAlign: 'center' }}>Login Form</Typography>
      <TextField
        id="login-email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <FormControl variant="outlined" sx={{ m: 1, width: '25ch' }}>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Button variant="contained" onClick={handleLogin}>Login</Button>
      <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
      <Typography variant="body2" style={{ textAlign: 'center', marginTop: '20px' }}>
        Don`t have an account?{' '}
        <Link type="button" variant="body2" onClick={() => navigate('/register')}>
        Click here to register.
        </Link>。
      </Typography>
    </Box>
  );
}
