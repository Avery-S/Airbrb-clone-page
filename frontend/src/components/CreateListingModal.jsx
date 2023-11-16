import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { DEFAULT_THUMBNAIL_URL } from '../helper/getLinks.jsx';
import CountrySelect from './CountrySelect.jsx';
import AmenitiesTags from './AmenitiesTags.jsx';
import PropertyTypeComboBox from './PropertyTypeComboBox';
import { fileToDataUrl } from '../helper/helperFuncs.jsx';

export default function CreateListingModal (props) {
  const initialMetadata = {
    propertyType: '',
    numberOfBathrooms: 1,
    numberOfBeds: 1,
    amenities: [],
    houseRules: '',
    rooms: {
      singleRoom: { beds: 1, roomNum: 0 },
      twinRoom: { beds: 2, roomNum: 0 },
      familyRoom: { beds: 3, roomNum: 0 },
      quadRoom: { beds: 4, roomNum: 0 },
    },
    imageList: [],
  };

  const initialAddress = {
    street: '',
    city: '',
    state: '',
    postCode: '',
    country: ''
  };

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState(initialAddress); // address structure
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(DEFAULT_THUMBNAIL_URL);
  const [metadata, setMetadata] = useState(initialMetadata);
  // const navigate = useNavigate();
  const [uploadedImg, setUploadedImg] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  // Modal close
  const handleClose = () => {
    props.onHide();
  };

  const validateInputs = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required.';
    if (!address.street.trim()) errors.street = 'Street is required.';
    if (!address.city.trim()) errors.city = 'City is required.';
    if (!address.state.trim()) errors.state = 'State is required.';
    if (!address.postCode.trim()) errors.postCode = 'PostCode is required.';
    if (!selectedCountry) errors.country = 'Country is required.';
    if (!price.trim()) errors.price = 'Price is required.';
    if (!metadata.propertyType) errors.propertyType = 'Property Type is required.';
    return errors;
  };

  // submit create list
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedAddress = {
      street: address.street.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      postCode: address.postCode.trim(),
      country: selectedCountry ? selectedCountry.label : '',
    };
    const trimmedPrice = price.trim();
    const errors = validateInputs();
    if (Object.keys(errors).length === 0) {
      const body = {
        title: trimmedTitle,
        address: trimmedAddress,
        price: trimmedPrice,
        thumbnail,
        metadata
      }
      console.log(body);
      props.createListing(body);
      handleClose();
    } else {
      setErrorMessages(errors);
    }
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      try {
        const imageList = await Promise.all(
          [...files].map(file => fileToDataUrl(file))
        );
        setMetadata(prevMetadata => ({
          ...prevMetadata,
          imageList: imageList
        }));
        setThumbnail(imageList[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClearImage = () => {
    setUploadedImg('');
    setThumbnail(DEFAULT_THUMBNAIL_URL);
  };

  const handleMetadataChange = (e) => {
    const { id, value } = e.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [id]: value
    }));
  };

  const handleAmenitiesChange = (newValue) => {
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      amenities: newValue
    }));
  };

  const handleCountryChange = (event, newValue) => {
    setAddress({ ...address, country: newValue ? newValue.label : '' });
    setSelectedCountry(newValue);
  };

  const updateRoomNumber = (roomType, change) => {
    setMetadata(prevMetadata => {
      const currentRoomNum = prevMetadata.rooms[roomType].roomNum;
      const newRoomNum = Math.max(currentRoomNum + change, 0);
      const updatedRooms = {
        ...prevMetadata.rooms,
        [roomType]: {
          ...prevMetadata.rooms[roomType],
          roomNum: newRoomNum
        }
      };
      const totalBeds = Object.values(updatedRooms).reduce(
        (sum, room) => sum + (room.beds * room.roomNum), 0);
      return {
        ...prevMetadata,
        rooms: updatedRooms,
        numberOfBeds: totalBeds
      };
    });
  };

  const roomTypes = [
    { id: 'singleRoom', label: 'Single Room' },
    { id: 'twinRoom', label: 'Twin Room' },
    { id: 'familyRoom', label: 'Family Room' },
    { id: 'quadRoom', label: 'Quad Room' },
  ];

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Grid container spacing={2}>
        <Grid xs={12} md={8} lg={4}> {/* image container */}
          <label htmlFor="thumbnail">Select an Image to Post</label >
          <input
            id="thumbnail"
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
            style={{ display: 'none' }}
          />
            <div>
              <img src={uploadedImg || DEFAULT_THUMBNAIL_URL} alt="Thumbnail" style={{ width: '85%', height: '85%' }} />
              <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              multiple/>
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              {uploadedImg && (
                <Button variant="secondary" onClick={handleClearImage}>Clear Image</Button>
              )}
          </div>
            </Grid>
            <Grid item xs={12} lg={8} container spacing={2}>
              <Grid item xs={9} md={7} lg={6}>
              <TextField
                fullWidth
                id="title"
                label="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errorMessages.title}
                helperText={errorMessages.title || ''}
                required
              />
            </Grid>
          {/* Address Section */}
          <Grid container spacing={2}>
          <Grid item xs={9} md={7} lg={6}>
              <TextField
                fullWidth
                id="street"
                label="Street"
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                error={!!errorMessages.street}
                helperText={errorMessages.street || ''}
                required
              />
            </Grid>
            <Grid item xs={9} md={7} lg={6}>
              <TextField
                fullWidth
                id="city"
                label="City"
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                error={!!errorMessages.city}
                helperText={errorMessages.city || ''}
                required
              />
            </Grid>
            <Grid item xs={9} md={7} lg={6}>
              <TextField
                fullWidth
                id="state"
                label="State"
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                error={!!errorMessages.state}
                helperText={errorMessages.state || ''}
                required
              />
            </Grid>
            <Grid item xs={9} md={7} lg={6}>
              <TextField
                fullWidth
                id="postCode"
                label="PostCode"
                type="text"
                value={address.postCode}
                onChange={(e) => setAddress({ ...address, postCode: e.target.value })}
                error={!!errorMessages.postCode}
                helperText={errorMessages.postCode || ''}
                required
              />
            </Grid>

            <Grid item xs={9} md={7} lg={6}>
              <CountrySelect
                value={selectedCountry}
                onChange={handleCountryChange}
                error={!!errorMessages.country}
                helperText={errorMessages.country || ''}
                required
              />
            </Grid>
          </Grid>
          {/* Price Input */}
          <Grid item xs={8} md={7} lg={6}>
              <TextField
                fullWidth
                id="price"
                label="Price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errorMessages.price}
                helperText={errorMessages.price || ''}
                required
              />
            </Grid>
          {/* Metadata Inputs */}
          <Grid item xs={11} md={7} lg={6}>
            <PropertyTypeComboBox
              value={metadata.propertyType}
              onChange={handleMetadataChange}
              error={!!errorMessages.propertyType}
              helperText={errorMessages.propertyType || ''}
            />
          </Grid>

          <Grid item xs={10} md={9} lg={8}>
              <TextField
                fullWidth
                id="numberOfBathrooms"
                label="Number Of Bathrooms"
                type="number"
                value={metadata.numberOfBathrooms}
                onChange={handleMetadataChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps = {{
                  min: '0'
                }}
              />
            </Grid>

            <Grid item xs={10} md={7} lg={6}>
              <TextField
                fullWidth
                id="numberOfBeds"
                label="Number Of Beds"
                type="number"
                value={metadata.numberOfBeds}
                onChange={handleMetadataChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: '1'
                }}
              />
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
            <List sx={{
              width: '80%',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'primary.main',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
          {roomTypes.map((room) => (
            <ListItem
              id={room.id}
              key={room.id}
              disableGutters
              sx={{ borderBottom: 1, borderColor: 'divider', padding: '10px' }}
            >
              <ListItemText
                primary={room.label}
                secondary={`Beds: ${metadata.rooms[room.id].beds}`}
                secondaryTypographyProps={{
                  style: { color: 'gray', fontSize: '0.875rem' }
                }}
              />
              <Grid container spacing={1} sx={{ width: 'auto', marginLeft: 'auto' }}>
                <Grid item>
                  <Button id={`decrease-${room.id}`} onClick={() => updateRoomNumber(room.id, -1)}>-</Button>
                </Grid>
                <Grid item>
                  <span>{metadata.rooms[room.id].roomNum}</span>
                </Grid>
                <Grid item>
                  <Button id={`increase-${room.id}`} onClick={() => updateRoomNumber(room.id, 1)}>+</Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
              <AmenitiesTags
            selectedAmenities={metadata.amenities}
            onChange={handleAmenitiesChange}
          />
          </Grid>
        <Grid item xs={12} md={9} lg={8}>
              <TextField
                fullWidth
                id="houseRules"
                label="House Rules"
                type="text"
                value={metadata.houseRules}
                onChange={handleMetadataChange}
              />
            </Grid>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Create Listing</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
