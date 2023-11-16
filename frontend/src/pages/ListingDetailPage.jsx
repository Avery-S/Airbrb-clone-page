import React from 'react'
import { useParams } from 'react-router-dom';
import { Box, Typography, Rating, Divider, Chip, useTheme, useMediaQuery, Button, Paper } from '@mui/material';

import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import ImageListDisplay from '../components/ImageListDisplay';
import { getUserRating } from '../helper/helperFuncs';
import BedListDisplay from '../components/BedListDisplay';
import LeaveReview from '../components/LeaveReview';
import BookingModal from '../components/BookingModal';

export default function ListingDetailPage (props) {
  const [listingInfo, setListingInfo] = React.useState([]);
  const [bookingInfo, setBookingInfo] = React.useState([]);
  const [diffDate, setDiffDate] = React.useState(-1);
  const [rateValue, setRateValue] = React.useState(0);
  const [reviewValue, setReviewValue] = React.useState('');
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  const { listingId } = useParams();

  React.useEffect(() => {
    getListingInfo();
    getBookings();
    if (props.currentPage === 'search' && props.searchDateRange.length === 2) {
      setDiffDate(props.searchDateRange[1].diff(props.searchDateRange[0], 'day'))
    }
    props.setCurrentPage('listing');
  }, []);

  const getListingInfo = async () => {
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject('GET', {}, false));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      setListingInfo(data.listing);
    }
  }

  const getBookings = async () => {
    const response = await fetch(`${BACKEND_URL}/bookings`, fetchObject('GET', {}, true));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      let bookings = data.bookings;
      console.log('listingDetailPage booking: ', bookings);
      if (bookings) {
        bookings = bookings.filter(booking => (
          String(booking.listingId) === String(listingId) && booking.owner === localStorage.getItem('userEmail')
        ));
        if (bookings && bookings.length !== 0) {
          setBookingInfo([...bookings]);
          console.log('setBookingInfo: ', bookingInfo);
        }
      }
    }
  }
  // Submit the review
  const handleReviewSubmit = async () => {
    if (rateValue === 0) {
      if (reviewValue === '') {
        props.setErrorModalMsg('Cannot leave an empty review');
      } else {
        props.setErrorModalMsg('Please rate first!');
      }
      props.setErrorModalShow(true);
    } else {
      if (bookingInfo) {
        const acceptedBookingId = bookingInfo.filter(booking => booking.status === 'accepted')[0].id;
        if (acceptedBookingId) {
          console.log('review: ', reviewValue)
          const reponse = await fetch(`${BACKEND_URL}/listings/${listingId}/review/${acceptedBookingId}`, fetchObject(
            'PUT', { review: { rating: rateValue, content: reviewValue } }, true
          ));
          const data = await reponse.json();
          if (data.error) {
            props.setErrorModalMsg(data.error);
            props.setErrorModalShow(true);
          } else {
            setRateValue(0);
            setReviewValue('');
            getListingInfo();
          }
        } else {
          props.setErrorModalMsg('You do not have an accepted booking yet');
          props.setErrorModalShow(true);
        }
      } else {
        props.setErrorModalMsg('You do not have an accepted booking yet');
        props.setErrorModalShow(true);
      }
    }
  }

  const [userRating, reviewLength] = getUserRating(listingInfo.reviews);

  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('md')); // Medium devices and up (laptops/desktops)
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Small to medium devices (tablets)
  const isPhone = useMediaQuery(theme.breakpoints.down('sm')); // Small devices (phones)

  let amenityHeight;
  if (isLaptop) {
    amenityHeight = '10vw'; // Adjust as needed for laptops/desktops
  } else if (isTablet) {
    amenityHeight = '20vw'; // Adjust as needed for tablets
  } else if (isPhone) {
    amenityHeight = '30vw'; // Adjust as needed for phones
  }
  if (!listingInfo || listingInfo.length === 0) {
    return <>Loading...</>;
  } else {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        margin: '1vw',
      }}>
        <BookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          availability={listingInfo.availability}
          token={props.token}
          listingId={listingId}
          price={listingInfo.price}
          getBookings={getBookings}
        />
        <ImageListDisplay images={listingInfo.metadata.imageList} />
        {/* Content */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: '2vw',
          justifyContent: 'space-between',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifySelf: 'flex-start',
            flex: '0.8'
          }}>
            <Typography variant='h4'>{ listingInfo.title }</Typography>
            <Typography variant='h6' fontWeight={1}>
              { Object.values(listingInfo.address).join(', ') }
            </Typography>
            {diffDate <= 0
              ? (<Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                  ${parseFloat(listingInfo.price)}/night
                </Typography>)
              : (<Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                  ${diffDate * parseFloat(listingInfo.price)}/stay
                </Typography>)}
            {reviewLength === 0
              ? (<Typography variant='subtitle2'> No Reviews </Typography>)
              : (<Box>
                <Rating name="user-rating" defaultValue={userRating} precision={0.1} readOnly />
                <Typography variant='subtitle2'>{reviewLength} reviews</Typography>
              </Box>)}
            <Divider>
              <Chip label="ROOMS" />
            </Divider>
            <Typography variant='subtitle2'>
              No. of Beds: {listingInfo.metadata.numberOfBeds}
            </Typography>
            <Typography variant='subtitle2'>
              No. of Baths: {listingInfo.metadata.numberOfBathrooms}
            </Typography>
            <BedListDisplay bedrooms={listingInfo.metadata.rooms} />
            <br/>
            <Divider>
              <Chip label="AMENITIES" />
            </Divider>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              height: { amenityHeight },
            }}>
              {listingInfo.metadata.amenities.map((amenity, index) => (
                <Typography variant='subtitle1' key={index}>
                  {amenity}
                </Typography>
              ))}
            </Box>
            <Divider>
              <Chip label="RULES" />
            </Divider>
            {listingInfo.metadata.houseRules
              ? <Typography variant='subtitle'>{ listingInfo.metadata.houseRules }</Typography>
              : <Typography variant='subtitle'>No Rules</Typography>}
            <Divider>
              <Chip label="REVIEWS" />
            </Divider>
            {!localStorage.getItem('token')
              ? <Typography>Log in to leave a review</Typography>
              : <LeaveReview
                handleSubmit={handleReviewSubmit}
                value={rateValue}
                setValue={setRateValue}
                textContent={reviewValue}
                setTextContent={setReviewValue}
              />}
            {reviewLength === 0
              ? (<Typography variant='subtitle2'> No Reviews </Typography>)
              : (listingInfo.reviews.map((review, index) => (
                <Box key={ index }>
                  <Rating name="user-rating" defaultValue={review.rating} precision={0.1} readOnly />
                  <Typography variant='subtitle2'>{review.content}</Typography>
               </Box>
                )))}
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
          >
            <Button variant="contained"
            onClick={() => setShowBookingModal(true)}
            sx={{
              display: 'flex',
              height: 'min-content',
              width: 'auto',
              justifySelf: 'flex-start',
            }} >Book</Button>
            <br/>
            {bookingInfo && bookingInfo.length !== 0 &&
                bookingInfo.map((booking, index) => (
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  key={index}
                >
                  <Typography>
                    Booked Date: {Object.values(booking.dateRange).join(' - ')}
                  </Typography>
                  {booking.status === 'accepted'
                    ? <Chip sx={{ width: 'max-content', alignSelf: 'flex-end' }} label="Accepted" color="success" />
                    : booking.status === 'declined'
                      ? <Chip sx={{ width: 'max-content', alignSelf: 'flex-end' }} label="Declined" color="error" />// Assuming you want a different label/color for non-accepted status
                      : <Chip sx={{ width: 'max-content', alignSelf: 'flex-end' }} label="Pending" color="info" />}
                </Paper>))
            }
          </Box>
        </Box>
      </Box>
    );
  }
}
