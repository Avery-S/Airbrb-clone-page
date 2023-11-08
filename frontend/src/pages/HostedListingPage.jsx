import React from 'react';
import checkToken from '../helper/checkToken';
import { Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import Button from '@mui/material/Button';

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

      setHostedListings(['']);
    }
  }

  React.useEffect(() => {
    updateHostedListings();
  }, []);

  return (
    <>
      {
        hostedListings.length !== 0
          ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0',
              }}>
                {hostedListings.map((hostedListing, index) => <ListingCard key={index} {...hostedListing} />)}
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
    </>
  );
}
