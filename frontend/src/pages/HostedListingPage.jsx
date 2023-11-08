import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ListingCard from '../components/ListingCard';
import checkToken from '../helper/checkToken';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import userProfileImg from '../styles/userProfile1.png';

// User Hosted Listings Page
export default function HostedListings (props) {
  // const [allListings, setAllListings] = React.useState([]);
  const [hostedListings, setHostedListings] = React.useState([]);
  // const [listingInfo, setListingInfo] = React.useState({});
  // const [listingAction, setListingAction] = React.useState('');

  checkToken(props.setToken);

  // get all listings when first enter this page
  React.useEffect(() => {
    getHostedListings(getListings);
  }, []);

  // TODO: test create, to delete
  const createListing = async () => {
    const response = await fetch(`${BACKEND_URL}/listings/new`, fetchObject(
      'POST',
      {
        title: 'listing 3',
        address: {},
        price: 350,
        thumbnail: userProfileImg,
        metadata: {
          propertyType: 'House',
          numberOfBathrooms: 1,
          numberOfBeds: 1,
          amenities: [],
          houseRules: ''
        }
      },
      true
    ));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      // add to hosted listings
      const listingInfo = await getListingInfo(data.listingId);
      const newHostedListings = [...hostedListings];
      if (listingInfo) {
        newHostedListings.push(listingInfo)
        setHostedListings(newHostedListings);
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
      return data;
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
  const getHostedListings = async (getListing) => {
    // TODO: get the listing information
    const userHostedListings = [];
    const allListings = await getListing();

    if (!allListings) {
      props.setErrorModalMsg(allListings.error);
      props.setErrorModalShow(true);
    } else {
      for (const listing of allListings) {
        if (listing.owner === localStorage.getItem('userEmail')) {
          const listingInfo = await getListingInfo(String(listing.id));
          if (listingInfo) {
            userHostedListings.push(listingInfo);
          }
        }
      }
      setHostedListings(userHostedListings);
      // setHostedListings(['', '', '', '', '', '']);
    }
  }

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
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Tooltip title="Create new listing" arrow>
                  <IconButton
                    sx={{ marginRight: '4vw', paddingTop: '1vw', alignSelf: 'flex-end' }}
                    onClick={createListing}
                    aria-label="Create new listing"
                  >
                      <AddCircleOutlineOutlinedIcon
                        color="primary"
                        fontSize='large'
                      />
                  </IconButton >
                </Tooltip>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                  height: '100%',
                  paddingLeft: '4vw',
                  paddingRight: '4vw',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
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
                  onClick={createListing}
                >
                  Create My Listing
                </Button>
              </Box>
            )
      }
    </Box>
  );
}
