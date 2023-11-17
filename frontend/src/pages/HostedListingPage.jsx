import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import checkToken from '../helper/checkToken';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import CreateListingModal from '../components/CreateListingModal';
import ListingCardBox from '../components/ListingCardBox';
import { getUserRating } from '../helper/helperFuncs';

// User Hosted Listings Page
export default function HostedListings (props) {
  const [hostedListings, setHostedListings] = React.useState([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  checkToken(props.setToken);

  // get all listings when first enter this page
  React.useEffect(() => {
    props.setCurrentPage('hosted');
    getHostedListings();
  }, []);
  // get hosted listings every 5 seconds
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     getHostedListings(getListings);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false)

  const createListing = async (body) => {
    const response = await fetch(`${BACKEND_URL}/listings/new`, fetchObject(
      'POST', body, true
    ));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      // add to hosted listings
      const listingInfo = await getListingInfo(data.listingId);
      const newHostedListings = [...hostedListings];
      const newAllListings = [...props.allListings];
      if (listingInfo) {
        const [userRating, reviewLength] = getUserRating(listingInfo.reviews);
        listingInfo.listingId = data.listingId;
        listingInfo.reviewLength = reviewLength;
        listingInfo.userRating = userRating;
        newHostedListings.push(listingInfo);
        setHostedListings(newHostedListings);
        newAllListings.push(listingInfo);
        props.setAllListings(newAllListings);
      }
    }
  }

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

  // get the hosted listings
  const getHostedListings = async () => {
    const userHostedListings = [];
    const allListings = await getListings();

    if (!allListings) {
      props.setErrorModalMsg(allListings.error);
      props.setErrorModalShow(true);
    } else {
      for (const listing of allListings) {
        if (listing.owner === localStorage.getItem('userEmail')) {
          const listingInfo = await getListingInfo(listing.id);
          if (listingInfo) {
            listingInfo.listingId = listing.id;
            userHostedListings.push(listingInfo);
          }
        }
      }
      setHostedListings(userHostedListings);
    }
  }

  return (
    <Box>
      {/* Create Listing Modal */}
      <CreateListingModal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        createListing={createListing}
        setErrorModalMsg={props.setErrorModalMsg}
        setErrorModalShow={props.setErrorModalShow}
      />
      {
        hostedListings.length !== 0
          ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Tooltip title="Create new listing">
                  <IconButton
                    sx={{ marginRight: '4vw', paddingTop: '1vw', alignSelf: 'flex-end' }}
                    onClick={handleShowCreateModal}
                    aria-label="Create new listing"
                  >
                    <AddCircleOutlineOutlinedIcon
                      color="primary"
                      fontSize='large'
                    />
                  </IconButton >
                </Tooltip>
                <ListingCardBox
                  listings={hostedListings}
                  {...props}
                  hostedListings={hostedListings}
                  setHostedListings={setHostedListings}
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
                  Create your first hosted listing!
                </Typography> <br/>
                <Button
                  variant="contained"
                  sx={{ width: 'contentWidth' }}
                  onClick={handleShowCreateModal}
                >
                  Create My Listing
                </Button>
              </Box>
            )
      }
    </Box>
  );
}
