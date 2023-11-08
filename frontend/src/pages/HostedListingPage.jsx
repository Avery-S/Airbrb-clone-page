import React from 'react';
import { Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';

import checkToken from '../helper/checkToken';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// User Hosted Listings Page
export default function HostedListings (props) {
  const [hostedListings, setHostedListings] = React.useState([]);

  checkToken(props.setToken);

  const updateHostedListings = async () => {
    const response = await fetch(`${BACKEND_URL}/listings`, fetchObject(
      'GET', null, false
    ));
    let listings = await response.json();
    console.log(listings.ok);
    if (listings.error) {
      props.setErrorModalShow(true);
      props.setErrorModalMsg(listings.error);
    } else {
      const userHostedListings = [];
      listings = listings.listings;
      // TODO: get the listing information
      for (const listing of listings) {
        if (listing.owner === localStorage.getItem('userEmail')) {
          userHostedListings.push(listing)
        }
      }

      setHostedListings(['', '', '', '', '']);
    }
  }

  React.useEffect(() => {
    updateHostedListings();
  }, []);

  // Check the screen size
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const matchesLG = useMediaQuery(theme.breakpoints.down('lg'));
  const matchesXL = useMediaQuery(theme.breakpoints.down('xl'));
  // Adjust the card width accordingly
  // values: {
  //   xs: 0,
  //   sm: 600,
  //   md: 900,
  //   lg: 1200,
  //   xl: 1536,
  // },
  let cardWidth;
  let gap;
  if (matchesSM) {
    cardWidth = '100%';
  } else if (matchesMD) {
    cardWidth = '31%';
    gap = '1%';
  } else if (matchesLG) {
    cardWidth = '31%';
    gap = '1%';
  } else if (matchesXL) {
    cardWidth = '23.4%';
    gap = '0.5%';
  } else {
    cardWidth = '22%';
    gap = '0.5%';
  }

  return (
    <Box>
      {
        hostedListings.length !== 0
          ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                marginTop: '4vw',
                marginLeft: '4vw',
                marginRight: '4vw',
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  maxWidth: 'calc(100% - 8vw)',
                  height: '100%',
                  margin: '0',
                  gap: { gap },
                  rowGap: '1%',
                }}>
                  {hostedListings.map((hostedListing, index) =>
                    <ListingCard key={index} {...hostedListing} cardWidth={cardWidth}
                  />)}
                </Box>
              </Box>
            )
          : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '15vh',
              }}>
                <Typography variant='h4' sx={{ textAlign: 'center', justifySelf: 'center', }}>
                  Create your first hosted listing!
                </Typography> <br/>
                <Button
                  variant="contained"
                  sx={{ width: 'contentWidth' }} // TODO: onClick -> openCreateModal
                >
                  Create My Listing
                </Button>
              </Box>
            )
      }
    </Box>
  );
}
