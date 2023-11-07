import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../helper/getBackendUrl';
import ErrorModal from '../components/ErrorModal';

// Register Page
export default function Register (props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState('');

  const navigate = useNavigate();

  // Manage the visibility of the password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCancle = () => {
    navigate('/');
  }

  // Register the user when submit is clicked
  const handleRegister = async () => {
    // Check if password matches passwordConfirm
    if (password !== passwordConfirm) {
      console.log('clicked');
      setModalMsg('Password must match with confirmed password!');
      setModalShow(true);
    } else {
      const registerResponse = await fetch(`${BACKEND_URL}/user/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email, password, name
        }),
        headers: {
          'Content-type': 'application/json',
        }
      });
      // Throw error & store token
      const data = await registerResponse.json();
      if (data.error) {
        setModalMsg(data.error);
        setModalShow(true);
      } else if (data.token) {
        localStorage.setItem('token', data.token);
        props.setToken(data.token);
        navigate('/');
        console.log(`token: ${data.token}`);
      }
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '60vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
      }}
      noValidate
      autoComplete="off"
    >
      <ErrorModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        msg={modalMsg}
      />
      <Typography variant='h4' sx={{ textAlign: 'center' }}>Register Form</Typography>
      {/* Register inputs */}
      <Box sx={{
        '& > :not(style)': { m: 1, width: '60vw' },
        display: 'flex',
        flexDirection: 'column',
      }}>
        <TextField id="register-email" label="Email" variant="outlined"
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <TextField id="register-name" label="Name" variant="outlined"
          onChange={e => setName(e.currentTarget.value)}
        />
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.currentTarget.value)}
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
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
          <OutlinedInput
            id="register-password-confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            onChange={e => setPasswordConfirm(e.currentTarget.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordConfirm}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
      </Box>
      {/* Button stack */}
      <Stack spacing={2} direction="row" sx={{
        justifyContent: 'center'
      }}>
        <Button variant="outlined" onClick={handleCancle}>Cancel</Button>
        <Button variant="outlined" onClick={() => navigate('/login')}>Back to Login</Button>
        <Button variant="contained" onClick={handleRegister}>Register</Button>
    </Stack>
    </Box>
  );
}
