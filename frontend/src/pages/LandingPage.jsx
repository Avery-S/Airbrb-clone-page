import React from 'react';
import { Box, Typography } from '@mui/material';

import checkToken from '../helper/checkToken';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import ListingCardBox from '../components/ListingCardBox';

// User Hosted Listings Page
export default function LandingPage (props) {
  const [publishedListings, setPublishedListings] = React.useState([]);

  checkToken(props.setToken);

  // get all listings when first enter this page
  React.useEffect(() => {
    fetchPublishedListings();
  }, []);
  // get hosted listings every 5 seconds
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     getHostedListings(getListings);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // get the listing info based on the listing id
  const getListingInfo = async (listingId) => {
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject(
      'GET', null
    ));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      return data.listing;
    }
  }

  // get all listings API
  const getListings = async () => {
    const response = await fetch(`${BACKEND_URL}/listings`, fetchObject(
      'GET', null
    ));
    let listings = await response.json();
    if (listings.error) {
      props.setErrorModalShow(true);
      props.setErrorModalMsg(listings.error);
    } else {
      listings = listings.listings;
      return listings;
    }
  }
  // TODO: sort listing, check booking status, display status
  const fetchPublishedListings = async () => {
    const allListings = await getListings();
    const newPublishedListings = [];

    if (!allListings) {
      props.setErrorModalMsg(allListings.error);
      props.setErrorModalShow(true);
    } else {
      for (const listing of allListings) {
        if (listing) {
          const listingInfo = await getListingInfo(listing.id);
          if (listingInfo.published) {
            listingInfo.listingId = listing.id;
            newPublishedListings.push(listingInfo);
          }
        }
      }
      setPublishedListings(newPublishedListings);
      console.log(`getHostedListings: ${publishedListings}`);
    }
  }

  return (
    <Box>
      {
        publishedListings.length !== 0
          ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <ListingCardBox
                  listings={publishedListings}
                  {...props}
                />
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
                  No listings available now, check later!
                </Typography> <br/>
              </Box>
            )
      }
    </Box>
  );
}
