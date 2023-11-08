import * as React from 'react';
import Card from '@mui/material/Card';
import { Box, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red, blue } from '@mui/material/colors';

import userProfileImg from '../styles/userProfile1.png';
import ConfirmModal from './ConfirmModal';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

export default function ListingCard (props) {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  console.log(props);

  // handle delete listing
  const handleDeleteListing = () => {
    setShowConfirmModal(true);
  }

  // delete the listing API
  const deleteListing = async () => {
    const listingId = props.listingId;
    // const listingInfo = props.dct.listing;
    console.log(props);
    console.log(`delete: ${listingId}`);
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject(
      'DELETE', {}, true
    ));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      let newHostedListings = props.hostedListings;
      console.log(props.hostedListings);
      newHostedListings = newHostedListings.filter((listingInfo) => String(listingInfo.listingId) !== String(listingId));
      props.setHostedListings(newHostedListings);
      console.log(newHostedListings);
      setShowConfirmModal(false);
    }
  }

  return (
    <>
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        msg='Are you sure you want to delete this listing?'
        func={deleteListing}
      />
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        justifySelf: 'flex-start',
        width: props.cardWidth,
        minWidth: '200px',
        margin: '0.5vw',
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute',
          right: '0',
          m: '0.5vw',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {props.owner
            ? (
                <>
                  <IconButton
                    aria-label="Edit Listing"
                  >
                    <EditOutlinedIcon
                      sx={{ color: blue[900] }}
                      fontSize='medium'
                    />
                  </IconButton >
                  <IconButton
                    aria-label="Delete Listing"
                    onClick={handleDeleteListing}
                  >
                    <DeleteForeverIcon
                      sx={{ color: red[500] }}
                      fontSize='medium'
                    />
                  </IconButton >
                </>
              )
            : (<></>)}
        </Box>
         <CardMedia
          component="img"
          image={userProfileImg}
          alt="Thumbnail"
          sx={{
            height: '100%',
            aspectRatio: 1,
            objectFit: 'cover'
          }}
        />
        <CardContent sx={{ width: '100%', height: '100%' }}>
          <Typography variant='h6'>Hello</Typography>
        </CardContent>
      </Card>
    </>
  );
}
