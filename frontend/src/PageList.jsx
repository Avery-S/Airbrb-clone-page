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
import ErrorModal from './components/ErrorModal';
import EditListingPage from './pages/EditListingPage'
import ListingDetailPage from './pages/ListingDetailPage';

// Main structure of the page: header, page, footer
export default function PageList () {
  const [token, setToken] = React.useState('');
  const [errorModalShow, setErrorModalShow] = React.useState(false);
  const [errorModalMsg, setErrorModalMsg] = React.useState('');
  const [allListings, setAllListings] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState('landing')
  const [publishedListings, setPublishedListings] = React.useState([]);
  const [resultListings, setResultListings] = React.useState([]);

  const commonProps = { errorModalShow, setErrorModalShow, errorModalMsg, setErrorModalMsg, token, setToken, currentPage, setCurrentPage };
  const listingProps = { allListings, setAllListings, publishedListings, setPublishedListings, resultListings, setResultListings };

  checkToken(setToken);

  const StyledFooter = styled('div')({
    // display: 'flex',
    position: 'relative',
    bottom: '0',
    width: '100%',
  });

  return (
    <Box sx={{
      height: 'min-content',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <ResponsiveAppBar {...commonProps} {...listingProps} />
      {/* Page */}
      <ErrorModal
        show={errorModalShow}
        onHide={() => setErrorModalShow(false)}
        msg={errorModalMsg}
      />
      <Box sx={{
        flexGrow: 1,
        height: '100%'
      }}>
        <Routes>
          <Route path="/" element={<LandingPage {...commonProps} {...listingProps} />}></Route>
          <Route path="/listings" element={<LandingPage {...commonProps} {...listingProps} />}></Route>
          <Route path="/register" element={<Register {...commonProps} />}></Route>
          <Route path="/login" element={<Login {...commonProps} />}></Route>
          <Route path="/my-hosted-listings" element={<HostedListings {...commonProps} { ...listingProps } />}></Route>
          <Route path="/edit-listing/:listingId" element={<EditListingPage {...commonProps} />}> </Route>
          <Route path="/listings/:listingId" element={<ListingDetailPage {...commonProps} />}> </Route>
          <Route path="/*" element={<LandingPage />}></Route>
        </Routes>
      </Box>
      {/* Footer */}
      <StyledFooter>
        This is footer
      </StyledFooter>
    </ Box>
  )
}
