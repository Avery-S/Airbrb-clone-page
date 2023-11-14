import React, { useEffect, useState } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button as ReactBtn } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

// Booking modal for book request
export default function BookingModal (props) {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  // const [chipData, setChipData] = React.useState(props.availability || []);
  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
  const token = React.useState(props.token);
  const [price] = React.useState(parseFloat(props.price) || 0);
  const [totalPrice, setTotalPrice] = useState(0);

  // console.log('price:', price);
  useEffect(() => {
    const nights = endDate.diff(startDate, 'day') + 1;
    setTotalPrice(nights * price);
  }, [startDate, endDate, props.price]);

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
      console.log(data.error);
    } else {
      console.log(data.bookingId);
      props.onHide();
    }
  };

  const handleCancelBooking = async () => {
    props.onHide();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size='xl'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
          {/* Display chip data */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              justifySelf: 'center',
              alignSelf: 'center',
              flexWrap: 'wrap',
              listStyle: 'none',
              width: '100%',
              minHeight: '5vh',
              p: 0.5,
              m: 0,
            }}
            component="ul"
          >
            <ListItem>
              <Chip label={`Start Date: ${startDate.format('DD/MM/YYYY')}`} />
            </ListItem>
            <ListItem>
              <Chip label={`End Date: ${endDate.format('DD/MM/YYYY')}`} />
            </ListItem>
          </Box>
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
                        onChange={(value) => setStartDate(value)}
                      />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label="End date picker"
                        value={endDate}
                        onChange={(value) => setEndDate(value)}
                      />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
            </Box>
          }
        </Box>
      </Modal.Body>
      <Modal.Footer>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ marginRight: '1em' }}>
            Total Price: ${totalPrice}
          </Typography>
          <ReactBtn variant='primary' onClick={handleConfirmBooking}>Confirm Book</ReactBtn>
        </Box>
        <ReactBtn variant='outline-secondary' onClick={handleCancelBooking}>Cancel</ReactBtn>
      </Modal.Footer>
    </Modal>
  );
}
