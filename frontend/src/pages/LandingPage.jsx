import React from 'react';
import { Box, Typography } from '@mui/material';

import checkToken from '../helper/checkToken';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import ListingCardBox from '../components/ListingCardBox';
import { getUserRating } from '../helper/helperFuncs';

// User Hosted Listings Page
export default function LandingPage (props) {
  const [bookings, setBookings] = React.useState([]);
  const [displayListings, setDisplayListings] = React.useState([...props.publishedListings]);

  checkToken(props.setToken);

  // get all listings when first enter this page
  React.useEffect(() => {
    props.setCurrentPage('landing');
    fetchPublishedListings();
  }, []);
  // display the search/landing listings
  React.useEffect(() => {
    switch (props.currentPage) {
      case 'landing':
        setDisplayListings([...props.publishedListings]);
        break;
      case 'search':
        setDisplayListings([...props.resultListings]);
        break;
    }
  }, [props.currentPage, props.publishedListings, props.resultListings])
  // get hosted listings every 5 seconds
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     getHostedListings(getListings);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // get the listing info based on the listing id
  // React.useEffect(() => {
  //   setPublishedListings(sortPublishedListings());
  // }, [publishedListings, bookings]);

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

  // get booking information API
  const getBookings = async () => {
    const response = await fetch(`${BACKEND_URL}/bookings`, fetchObject('GET'));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      return data.bookings;
    }
  }

  // sort the published listings, put booked listings in front
  const sortPublishedListings = (newPublishedListings, newBookings) => {
    const bookingIds = new Set(newBookings.map(booking => booking.listingId));

    const sortedListings = [...newPublishedListings].sort((a, b) => {
      const aInBookings = bookingIds.has(a.id);
      const bInBookings = bookingIds.has(b.id);

      if (aInBookings && !bInBookings) {
        return -1;
      } else if (!aInBookings && bInBookings) {
        return 1;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return sortedListings;
  }

  // get the published listings
  const fetchPublishedListings = async () => {
    const allListings = await getListings();
    const bookings = await getBookings();
    let newPublishedListings = [];
    const newBookings = [];

    if (!allListings || !bookings) {
      props.setErrorModalMsg(allListings.error || bookings.error);
      props.setErrorModalShow(true);
    } else {
      for (const listing of allListings) {
        if (listing) {
          for (const booking of bookings) {
            if (booking) {
              if (booking.owner === localStorage.getItem('userEmail')) {
                newBookings.push(booking);
              }
            }
          }
          const listingInfo = await getListingInfo(listing.id);
          if (listingInfo) {
            if (listingInfo.published) {
              const [userRating, reviewLength] = getUserRating(listingInfo.reviews);
              listingInfo.listingId = listing.id;
              listingInfo.reviewLength = reviewLength;
              listingInfo.userRating = userRating;
              newPublishedListings.push(listingInfo);
            }
          }
        }
      }
      newPublishedListings = sortPublishedListings(newPublishedListings, newBookings);
      setBookings(bookings);
      props.setPublishedListings(newPublishedListings);
      console.log(`newBookings: ${newBookings}`);
    }
  }

  return (
    <Box>
      {
        displayListings.length !== 0
          ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <ListingCardBox
                  listings={displayListings}
                  bookings={bookings}
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
