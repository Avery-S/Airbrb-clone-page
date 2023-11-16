import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ToggleButtons from '../components/ToggleButtons';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

export default function ManagePage (props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, postedOn, listingId } = location.state;
  const [bookingInfo, setBookingInfo] = React.useState([]);
  const [totalBookedDays, setTotalBookedDays] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const postedDate = dayjs(postedOn);
  const daysSincePosted = dayjs().diff(postedDate, 'day') + 1;

  // console.log(token, postedOn);
  // console.log('props:',props);
  // console.log('listingId:',listingId);

  useEffect(() => {
    getBookings();
  }, []);

  const handleBack = () => {
    navigate('/my-hosted-listings');
  }

  const getBookings = async () => {
    const response = await fetch(`${BACKEND_URL}/bookings`, fetchObject('GET', {}, true));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      let bookings = data.bookings;
      // console.log('listingDetailPage booking: ', bookings);
      if (bookings) {
        bookings = bookings.filter(booking => (
          String(booking.listingId) === String(listingId)));
        if (bookings && bookings.length !== 0) {
          setBookingInfo([...bookings]);
          // console.log('setBookingInfo: ', bookingInfo);
          // console.log('postedDate:', postedDate);
        }
      }
    }
  }
  useEffect(() => {
    console.log(bookingInfo);
    if (bookingInfo && bookingInfo.length > 0) {
      // console.log('booking info in user effect:',bookingInfo)
      const newTotalBookedDays = calculateTotalBookedDays(bookingInfo);
      const newTotalProfit = calculateTotalProfit(bookingInfo);
      setTotalBookedDays(newTotalBookedDays);
      setTotalProfit(newTotalProfit);
    }
  }, [bookingInfo]);

  const calculateTotalBookedDays = (bookings) => {
    const currentYear = dayjs().year();
    return bookings.reduce((totalDays, booking) => {
      if (booking.status === 'accepted' && dayjs(booking.dateRange.startDate, 'DD/MM/YYYY').year() === currentYear) {
        const startDate = formatAndValidateDate(booking.dateRange.startDate);
        const endDate = formatAndValidateDate(booking.dateRange.endDate);
        if (startDate && endDate) {
          const days = endDate.diff(startDate, 'day') + 1;
          return totalDays + days;
        }
      }
      return totalDays;
    }, 0);
  };

  const calculateTotalProfit = (bookings) => {
    const currentYear = dayjs().year();
    return bookings.reduce((totalProfit, booking) => {
      if (booking.status === 'accepted' && dayjs(booking.dateRange.startDate, 'DD/MM/YYYY').year() === currentYear) {
        return totalProfit + Number(booking.totalPrice);
      }
      return totalProfit;
    }, 0);
  };

  const acceptBooking = async (bookingId) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await fetch(`${BACKEND_URL}/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: headers,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Booking accepted successfully:', data);
        await getBookings();
      } else {
        console.error('Error accepting booking:', data.error);
      }
    } catch (error) {
      console.error('Network or other error:', error);
    }
  };

  const declineBooking = async (bookingId) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await fetch(`${BACKEND_URL}/bookings/decline/${bookingId}`, {
        method: 'PUT',
        headers: headers,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Booking declined successfully:', data);
        await getBookings();
      } else {
        console.error('Error decline booking:', data.error);
      }
    } catch (error) {
      console.error('Network or other error:', error);
    }
  };

  const formatAndValidateDate = (dateStr) => {
    const formattedDate = dayjs(dateStr, 'DD/MM/YYYY');
    return formattedDate.isValid() ? formattedDate : null;
  };

  const renderCards = bookingInfo.map((booking) => {
    const startDate = formatAndValidateDate(booking.dateRange.startDate);
    const endDate = formatAndValidateDate(booking.dateRange.endDate);
    let nightsDisplay = '';
    if (startDate && endDate) {
      const nights = endDate.diff(startDate, 'day');
      nightsDisplay = `${nights} nights`;
    }

    return (
      <Box marginBottom={2} key={booking.id}>
      <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Order ID: {booking.id}
              </Typography>
              <Typography variant="h6" component="div">
              Date Range: {booking.dateRange.startDate} - {booking.dateRange.endDate}, {nightsDisplay}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Orderer: {booking.owner}
                <br/>
                Status: {booking.status}
              </Typography>
              <Typography variant="body2">
                Profit: ${booking.totalPrice}
              </Typography>
            </CardContent>
            <CardActions>
              <ToggleButtons
                onAccept={() => acceptBooking(booking.id)}
                onDecline={() => declineBooking(booking.id)}
                status={booking.status}
              />
            </CardActions>
          </Card>
        </Box>
    );
  });

  return (
    <>
        <IconButton onClick={handleBack} aria-label="back">
        <ChevronLeftIcon />
      </IconButton>

    <Grid container spacing={2} padding={2}>
      <Grid item padding={2} xs={10} md={5}>
        <Card>
            <CardContent>
              <Typography variant="h6">Listing Details</Typography>
              <Typography color="text.secondary">Posted On: {postedDate.format('DD/MM/YYYY')}</Typography>
              <Typography color="text.secondary">Days Since Posted: {daysSincePosted} days</Typography>
              <Typography color="text.secondary">Total Annual Booked Days: {totalBookedDays} days</Typography>
              <Typography color="text.secondary">Total Annual Profit: ${totalProfit}</Typography>
            </CardContent>
        </Card>
      </Grid>
      <Grid item padding={2} xs={10} md={7}>
        <Box sx={{ minWidth: 275, maxHeight: '70vh', overflowY: 'auto', }}>
            {renderCards}
          </Box>
      </Grid>
    </Grid>
    </>
  )
}
