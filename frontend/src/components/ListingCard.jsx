import * as React from 'react';
import Card from '@mui/material/Card';
import { Box, CardMedia, IconButton, Typography, Chip, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { red, blue, green } from '@mui/material/colors';
import Rating from '@mui/material/Rating';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import { useNavigate } from 'react-router-dom';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
// import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
// import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';

import ConfirmModal from './ConfirmModal';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import AvailabilityModal from './AvailabilityModal';
import { getUserRating } from '../helper/helperFuncs';

export default function ListingCard (props) {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const navigate = useNavigate();
  const [showAvailabilityModal, setShowAvailabilityModal] = React.useState(false);
  const [availabilities, setAvailabilities] = React.useState([]);
  const [ifPublished, setIfPublished] = React.useState(props.published);
  const [bookingInfo, setBookingInfo] = React.useState(null);

  const isMounted = React.useRef(false);
  // find the booking status
  React.useEffect(() => {
    if (props.bookings && props.bookings.length !== 0) {
      const bookingList = props.bookings.find(booking => String(booking.listingId) === String(props.listingId) && localStorage.getItem('userEmail') === booking.owner);
      if (bookingList) {
        setBookingInfo(bookingList);
      }
    }
    isMounted.current = true;
    return () => { isMounted.current = false; }
  }, [props.bookings])

  // handle delete listing
  const handleDeleteListing = () => {
    setShowConfirmModal(true);
  }

  // handle click on card
  const handleCardClick = () => {
    if (props.currentPage !== 'hosted') {
      navigate(`/listings/${props.listingId}`);
    }
  }
  // handle edit listing
  const handleEditListing = () => {
    const listingId = props.listingId;
    props.setCurrentPage('edit');
    navigate(`/edit-listing/${listingId}`, { state: { token: props.token } });
  }

  // Viewing booking requests and history
  const handleManageListing = () => {
    const listingId = props.listingId;
    props.setCurrentPage('manage');
    navigate(`/manage/${listingId}`, {
      state: {
        token: props.token,
        postedOn: props.postedOn,
        listingId: listingId,
      }
    });
  }

  const [userRating, reviewLength] = getUserRating(props.reviews);
  const boxShadow = ifPublished && props.ifOwner
    ? '0.5vw 0.5vw 0.5vw rgba(0, 128, 0, 0.5)'
    : '0.1vw 0.1vw 0.1vw grey';
  const publishedIconColor = ifPublished && props.ifOwner
    ? green[700]
    : '';

  const hover = props.currentPage !== 'hosted'
    ? {
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
        cursor: 'pointer',
      }
    : {
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
      };
  // delete the listing API
  const deleteListing = async () => {
    const listingId = props.listingId;
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject(
      'DELETE', {}, true
    ));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      let newHostedListings = props.hostedListings;
      newHostedListings = newHostedListings.filter((listingInfo) => String(listingInfo.listingId) !== String(listingId));
      const newAllListings = props.allListings.filter((listingInfo) => String(listingInfo.listingId) !== String(listingId));
      if (isMounted.current) {
        props.setHostedListings(newHostedListings);
        props.setAllListings(newAllListings);
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
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifySelf: 'flex-start',
          width: props.cardWidth,
          minWidth: '200px',
          margin: '0.5vw',
          position: 'relative',
          boxShadow: { boxShadow },
          '&:hover': { ...hover },
        }}
        onClick={handleCardClick}
      >
        {
          props.ifOwner && props.currentPage === 'hosted'
            ? (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: '0.5vw',
                  right: '0.5vw',
                }}
                aria-label='If published'
                onClick={() => setShowAvailabilityModal(true)}
              >
                <Tooltip title={ !ifPublished ? 'Publish' : 'Unpublish' } placement='right-start'>
                  <PublishedWithChangesIcon
                    fontSize='medium'
                    sx={{ color: publishedIconColor }}
                  />
                </Tooltip>
              </IconButton>
              )
            : (
                bookingInfo && bookingInfo.length !== 0
                  ? (
                      bookingInfo.status === 'accepted'
                        ? <Chip sx={{ position: 'absolute', right: '0.5vw' }} label="Accepted" color="success" />
                        : bookingInfo.status === 'denied'
                          ? <Chip sx={{ position: 'absolute', right: '0.5vw', top: '0.5vw' }} label="Denied" color="error" />// Assuming you want a different label/color for non-accepted status
                          : <Chip sx={{ position: 'absolute', right: '0.5vw', top: '0.5vw' }} label="Pending" color="info" />
                    )
                  : null // Or any other fallback JSX for when bookingInfo is not available
              )
        }
        <AvailabilityModal
          show={showAvailabilityModal}
          onHide={() => setShowAvailabilityModal(false)}
          availabilities={availabilities}
          setAvailabilities={setAvailabilities}
          ifPublished={ifPublished}
          setIfPublished={setIfPublished}
          {...props}
        />
        <Box sx={{
          position: 'absolute',
          right: '0',
          m: '0.5vw',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Edit Btns for owners, or status for users */}
          {props.ifOwner && props.currentPage === 'hosted'
            ? (
                <>
                <IconButton
                    aria-label="Viewing booking requests and history"
                    onClick={handleManageListing}
                  >
                    <FactCheckIcon
                      sx={{ color: '#00f584' }}
                      fontSize='medium'
                    />
                  </IconButton >
                  <IconButton
                    aria-label="Edit Listing"
                    onClick={handleEditListing}
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
          image={props.thumbnail}
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
              <Typography variant='subtitle2' color='grey'>
                { props.address.city } ·
                { props.address.country }
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
