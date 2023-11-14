import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button as ReactBtn } from 'react-bootstrap';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

// Booking modal for book request
export default function BookingModal (props) {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const availability = props.availability;
  const token = React.useState(props.token);
  const [price] = React.useState(parseFloat(props.price) || 0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const nights = endDate.diff(startDate, 'day');

  // console.log('price:', price);
  useEffect(() => {
    if (availability.length > 0) {
      const firstAvailableRange = availability[0];
      const initialStartDate = dayjs(firstAvailableRange.startDate);
      const initialEndDate = dayjs(firstAvailableRange.endDate);
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
    }
  }, [availability]);

  useEffect(() => {
    // 计算总价格
    setTotalPrice(nights * price);
  }, [startDate, endDate, price]);

  const handleConfirmBooking = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await
    fetch(`${BACKEND_URL}/bookings/new/${props.listingId}`, fetchObject(
      'POST', {
        dateRange: {
          startDate: startDate.format('DD/MM/YYYY'),
          endDate: endDate.format('DD/MM/YYYY'),
        },
        totalPrice: totalPrice
      }, true, headers));
    const data = await response.json();
    if (data.error) {
      showSnackbar(data.error);
    } else {
      console.log(data.bookingId);
      showSnackbar('Booking request submitted successfully!');
      setTimeout(() => props.onHide(), 1500);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleStartDateChange = (value) => {
    const newStartDate = dayjs(value);
    if (newStartDate.isAfter(endDate, 'day')) {
      showSnackbar('Start date must be before end date');
    } else if (!isDateInRangeValid(newStartDate, endDate)) {
      showSnackbar('Selected date range contains invalid dates');
    } else {
      setStartDate(newStartDate);
    }
  };
  const handleEndDateChange = (value) => {
    const newEndDate = dayjs(value);
    if (startDate.isAfter(newEndDate, 'day')) {
      showSnackbar('End date must be after start date');
    } else if (!isDateInRangeValid(startDate, newEndDate)) {
      showSnackbar('Selected date range contains invalid dates');
    } else {
      setEndDate(newEndDate);
    }
  };

  const handleCancelBooking = async () => {
    props.onHide();
  };

  // check date in valid range
  const isDateValid = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return props.availability.some(range =>
      dayjs(formattedDate).isBetween(dayjs(range.startDate).format('YYYY-MM-DD'),
        dayjs(range.endDate).format('YYYY-MM-DD'),
        null, '[]')
    );
  };

  const isDateInRangeValid = (start, end) => {
    let currentDay = dayjs(start);
    const lastDay = dayjs(end);

    while (currentDay.isBefore(lastDay, 'day') || currentDay.isSame(lastDay, 'day')) {
      if (!isDateValid(currentDay.toDate())) {
        return false;
      }
      currentDay = currentDay.add(1, 'day');
    }
    return true;
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size='xl'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={10000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
    />
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Set Booking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                flex: '2',
              }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label="Start date picker"
                        value={startDate}
                        onChange={handleStartDateChange}
                        shouldDisableDate={date => !isDateValid(date)}
                      />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label="End date picker"
                        value={endDate}
                        onChange={handleEndDateChange}
                        shouldDisableDate={date => !isDateValid(date)}
                      />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
            </Box>
          }
        </Box>
      </Modal.Body>
      <Modal.Footer>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography sx={{ fontSize: '0.875rem', color: 'gray', marginRight: '1em' }}>
          {nights} nights x ${price} per night
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '0.5em' }}>
          <Typography sx={{ marginRight: '1em' }}>
            Total Price: ${totalPrice}
          </Typography>
        </Box>
      </Box>
      <ReactBtn variant='primary' onClick={handleConfirmBooking}>Confirm Book</ReactBtn>
      <ReactBtn variant='outline-secondary' onClick={handleCancelBooking}>Cancel</ReactBtn>
    </Modal.Footer>

    </Modal>
  );
}
