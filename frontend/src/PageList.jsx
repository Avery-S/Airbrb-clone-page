import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import styled from '@emotion/styled';

import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ResponsiveAppBar from './components/NavBar';
import checkToken from './helper/checkToken';
import Login from './pages/Login';
import HostedListings from './pages/HostedListingPage';

// Main structure of the page: header, page, footer
export default function PageList () {
  const [token, setToken] = React.useState('');

  checkToken(setToken);

  const StyledFooter = styled('div')({
    display: 'flex',
    position: 'relative',
    bottom: '0',
  });

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <ResponsiveAppBar token={token} setToken={setToken} />
      {/* Page */}
      <Box sx={{
        flexGrow: 1,
        height: '100%'
      }}>
        <Routes>
          <Route path="/" element={<LandingPage token={token} setToken={setToken} />}></Route>
          <Route path="/register" element={<Register token={token} setToken={setToken} />}></Route>
          <Route path="/Login" element={<Login token={token} setToken={setToken} />}></Route>
          <Route path="/myHostedListings" element={<HostedListings token={token} setToken={setToken} />}></Route>
          <Route path="/*" element={<LandingPage token={token} setToken={setToken} />}></Route>
        </Routes>
      </Box>
      {/* Footer */}
      <StyledFooter>
        This is footer
      </StyledFooter>
    </ Box>
  )
}
