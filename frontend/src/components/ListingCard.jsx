import * as React from 'react';
import Card from '@mui/material/Card';
import { Box, CardMedia, IconButton, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red, blue } from '@mui/material/colors';
import Rating from '@mui/material/Rating';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
// import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
// import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';

import userProfileImg from '../styles/userProfile1.png';
import ConfirmModal from './ConfirmModal';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

export default function ListingCard (props) {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  console.log(props);

  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; }
  }, [])

  // handle delete listing
  const handleDeleteListing = () => {
    setShowConfirmModal(true);
  }

  const getUserRating = () => {
    const reviews = props.reviews;
    let userRating = 0;
    const reviewLength = reviews.length;
    for (const review of reviews) {
      userRating += parseFloat(review.rating);
    }
    userRating /= reviewLength;
    return [userRating, reviewLength]
  }

  const [userRating, reviewLength] = getUserRating();

  // delete the listing API
  const deleteListing = async () => {
    const listingId = props.listingId;
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
      const newAllListings = props.allListings.filter((listingInfo) => String(listingInfo.listingId) !== String(listingId));
      if (isMounted.current) {
        props.setHostedListings(newHostedListings);
        props.setAllListings(newAllListings);
        console.log(newHostedListings);
        setShowConfirmModal(false);
      }
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
          {/* Edit Btns for owners, or status for users */}
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
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          paddingBottom: '1vw',
        }}>
          <Box sx={{
            display: 'flex',
            alignSelf: 'center',
          }}>
            <Typography variant='h6' fontWeight='bold'>{ props.title }</Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
            <Box sx={{
              display: 'flex',
              justifySelf: 'flex-start',
              flexDirection: 'column',
            }}>
              <Typography variant='subtitle2'>
                <MapsHomeWorkOutlinedIcon fontSize='small'/>
                { props.metadata.propertyType }
              </Typography>
              <Typography variant='subtitle2' color='grey'>
                { props.metadata.numberOfBeds } bed ·
                { props.metadata.numberOfBathrooms } bathroom
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold' sx={{
                display: 'flex',
                alignSelf: 'flex-start',
                textDecoration: 'underline',
              }}>
                ${props.price}&nbsp;/ night
              </Typography>
              {/* <Typography variant='subtitle2' color='grey'sx={{ display: 'inline', textDecoration: 'none' }}>
                (per night)
              </Typography> */}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              {
                reviewLength === 0
                  ? (<Typography variant='subtitle2'> No Reviews </Typography>)
                  : (<>
                      <Rating name="user-rating" defaultValue={userRating} precision={0.1} readOnly />
                    <Typography variant='subtitle2'>{ reviewLength } reviews</Typography>
                    </>)
              }
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
}
