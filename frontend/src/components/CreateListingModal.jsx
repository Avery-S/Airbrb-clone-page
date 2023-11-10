import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { fileToDataUrl } from '../helper/fileToDataUrl.jsx';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';

// import checkToken from '../helper/checkToken';
import { DEFAULT_THUMBNAIL_URL } from '../helper/getLinks.jsx';
import CountrySelect from './CountrySelect.jsx';
import AmenitiesTags from './AmenitiesTags.jsx';
import PropertyTypeComboBox from './PropertyTypeComboBox';

export default function CreateListingModal (props) {
  const initialMetadata = {
    propertyType: '',
    numberOfBathrooms: 1,
    numberOfBeds: 1,
    amenities: [],
    houseRules: '',
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

  // Modal close
  const handleClose = () => {
    props.onHide();
  };

  // submit create list
  const handleSubmit = (event) => {
    event.preventDefault();
    const body = {
      title,
      address,
      price,
      thumbnail,
      metadata
    }
    console.log(address);
    props.createListing(body);
    handleClose();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setUploadedImg(dataUrl);
        setThumbnail(dataUrl);
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
        <Grid xs={4}> {/* image container */}
          <label htmlFor="thumbnail">Select an Image to Post:</label>
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
              <input accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
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
            <Grid item xs={8} container spacing={3}>
              <Grid item xs={7}>
              <TextField
                fullWidth
                id="title"
                label="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
          {/* Address Section */}
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField
                fullWidth
                id="street"
                label="Street"
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="city"
                label="City"
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="state"
                label="State"
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="postCode"
                label="PostCode"
                type="text"
                value={address.postCode}
                onChange={(e) => setAddress({ ...address, postCode: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <CountrySelect
                value={address.country}
                onChange={(event, newValue) => {
                  setAddress({ ...address, country: newValue ? newValue.label : '' });
                }}
              />
            </Grid>
          </Grid>
          {/* Price Input */}
          <Grid item xs={6}>
              <TextField
                fullWidth
                id="price"
                label="Price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Grid>
          {/* Metadata Inputs */}
          <Grid item xs={7}>
            <PropertyTypeComboBox
              value={metadata.propertyType}
              onChange={handleMetadataChange}
            />
          </Grid>

          <Grid item xs={6}>
              <TextField
                fullWidth
                id="numberOfBathrooms"
                label="Number Of Bathrooms"
                type="number"
                value={metadata.numberOfBathrooms}
                onChange={handleMetadataChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps = {{
                  min: '0'
                }}
              />
            </Grid>

            <Grid item xs={6}>
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

            <Grid item xs={10}>
              <AmenitiesTags
            selectedAmenities={metadata.amenities}
            onChange={handleAmenitiesChange}
          />
          </Grid>
        <Grid item xs={10}>
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
