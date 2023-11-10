import React from 'react';
import { Chip, Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button as ReactBtn } from 'react-bootstrap';
// import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';

export default function AvailabilityModal (props) {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [chipData, setChipData] = React.useState(props.availability);
  console.log(props);
  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handdleSet = () => {
    console.log(`start/end date: ${startDate} ${endDate}`);
    if (startDate.isAfter(endDate)) {
      props.setErrorModalMsg('Invalid start / end date');
      props.setErrorModalShow(true);
    } else {
      console.log(`start/end date: ${startDate} ${endDate}`);
      const newChipList = [...chipData];
      const dateString = `${startDate.format('DD/MM/YYYY').toString()}-${endDate.format('DD/MM/YYYY').toString()}`;
      newChipList.push({
        label: dateString,
        key: dateString,
        startDate: startDate.format('DD/MM/YYYY').toString(),
        endDate: endDate.format('DD/MM/YYYY').toString(),
      });
      setChipData(newChipList);
    }
  };

  // TODO: unpublish if published, also disable other buttons and add unpublish button
  const handlePublish = async () => {
    if (chipData.length === 0) {
      props.setErrorModalMsg('Set at least one start & end date');
      props.setErrorModalShow(true);
    } else {
      const response = await fetch(`${BACKEND_URL}/listings/publish/${props.listingId}`, fetchObject(
        'PUT', {
          availability: chipData,
        }
      ));
      const data = await response.json();
      if (data.error) {
        props.setErrorModalMsg(data.error);
        props.setErrorModalShow(true);
      } else {
        props.setAvailabilities(chipData);
        props.setIfPublished(true);
        props.onHide();
      }
    }
  }

  // unpulish the listing
  const handleUnpublish = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/listings/unpublish/${props.listingId}`, fetchObject('PUT', {}));
      const data = await response.json();
      if (data.error) {
        props.setErrorModalMsg(data.error);
        props.setErrorModalShow(true);
      } else {
        props.setIfPublished(false);
        props.setAvailabilities([]);
        setChipData([]);
      }
    } catch (error) {
      props.setErrorModalMsg(error);
      props.setErrorModalShow(true);
    }
  }

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
          Set Availabilities
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
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
            {chipData.map((data) => {
              return (
                <ListItem key={data.key}>
                  {
                    !props.ifPublished
                      ? (<Chip
                        label={data.label}
                        onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                      />)
                      : (<Chip label={data.label} />)
                  }
                </ListItem>
              );
            })}
          </Box>
          { !props.ifPublished &&
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
              <Button variant="contained"
                sx={{
                  alignSelf: 'center',
                  justifySelf: 'center',
                  display: 'flex',
                  flex: '0.5',
                  padding: '1vw',
                }}
                onClick={handdleSet}
              >Set</Button>
            </Box>
          }
        </Box>
      </Modal.Body>
      <Modal.Footer>
        {
          !props.ifPublished
            ? <ReactBtn variant='primary' onClick={handlePublish}>Publish</ReactBtn>
            : <ReactBtn variant='primary' onClick={handleUnpublish}>Unpublish</ReactBtn>
        }
        <ReactBtn variant='outline-secondary' onClick={props.onHide}>Cancel</ReactBtn>
      </Modal.Footer>
    </Modal>
  );
}
