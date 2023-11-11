// 排版
import React, { useEffect, useState } from 'react';
import { TextField, Grid, Box, } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { fileToDataUrl } from '../helper/fileToDataUrl.jsx';
import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import { DEFAULT_THUMBNAIL_URL } from '../helper/getLinks.jsx';
import CountrySelect, { countries } from '../components/CountrySelect.jsx';
import AmenitiesTags from '../components/AmenitiesTags.jsx';
import PropertyTypeComboBox from '../components/PropertyTypeComboBox';
import MessageAlert from '../components/MessageAlert';

export default function EditListingPage () {
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
  const { listingId } = useParams(); 
  // const [listingData, setListingData] = useState(null);
  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState(initialAddress); // address structure
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(DEFAULT_THUMBNAIL_URL);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [uploadedImg, setUploadedImg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
const [alertContent, setAlertContent] = useState('');
const [alertType, setAlertType] = useState('success'); // 可以是 'success', 'danger' 等
const [selectedCountry, setSelectedCountry] = useState(null);

  // get all listings API
  const getListing = async () => {
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject(
      'GET', null
    ));
    const data = await response.json();
    if (data.error) {
      console.error('Error fetching listings:', data.error);
    } else {
      // 更新状态变量setListingData(data);
      const { address, metadata, price, title, thumbnail } = data.listing;
      setTitle(title);
      setPrice(price);
      setAddress(address);
      setMetadata(metadata);
      setThumbnail(thumbnail);
      setUploadedImg(thumbnail);
      const fetchedCountry = countries.find(c => c.label === data.listing.address.country);
      setSelectedCountry(fetchedCountry); // 设置选中的国家对象
      setMetadata(data.listing.metadata);
      // console.log(metadata.propertyType);
    }
  };
    // publish new list
    const updateListing = async (body) => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject(
        'PUT', body, true, headers
      ));
      let listings = await response.json();
      if (listings.error) {
        console.error('Error fetching listings:', listings.error);
        setAlertContent('Error updating listing: ' + listings.error);
        setAlertType('danger');
        setShowAlert(true);
      } else {
        // console.log(listings)
        setAlertContent('Listing updated successfully!');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      navigate('/my-hosted-listings');
    }, 3000); // 3 seconds later navigate
      }
    };

  useEffect(() => {
    getListing();
  }, [listingId]); // 当listingId改变时，useEffect将重新运行

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      title,
      address,
      price,
      thumbnail,
      metadata
    };
    await updateListing(body);
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

  const handleCountryChange = (event, newValue) => {
    setAddress({ ...address, country: newValue ? newValue.label : '' });
    setSelectedCountry(newValue); // 更新 selectedCountry 状态
  };

  return (
    <>
    {showAlert && (
      <MessageAlert
        msgType={alertType}
        msgContent={alertContent}
      />
    )}
    <form onSubmit={handleSubmit}>
      <Box>
    <Grid container spacing={2}>
    <Grid item xs={4} > {/* image container */}
    <Box padding={2}>
    <Box padding={1}><label htmlFor="thumbnail">Select an Image to Post:</label></Box>
      <Box padding={1}>
        <input
        id="thumbnail"
        type="text"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        required
        style={{ display: 'none' }}
      />
      </Box>
      <Box padding={1}>
              <div>
          <img src={uploadedImg || DEFAULT_THUMBNAIL_URL} alt="Thumbnail" style={{ width: '85%', height: '85%' }} />
          <input accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Box padding={1}>
            {uploadedImg && (
            <Button variant="secondary" onClick={handleClearImage}>Clear Image</Button>
          )}
          </Box>
      </div>
      </Box>
    </Box>

        </Grid>
        <Grid item xs={8} >
          <Grid item xs={7} md={4} lg={3}>
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
      <Grid item xs={6} md={3} lg={2}>
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
        <Grid item xs={6} md={3} lg={2}>
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
        <Grid item xs={6} md={3} lg={2}>
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
        <Grid item xs={6} md={3} lg={2}>
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

        <Grid item xs={7} md={4} lg={3}>
          <CountrySelect
            value={selectedCountry}
            onChange={handleCountryChange}
          />
        </Grid>
      </Grid>
      {/* Price Input */}
      <Grid item xs={6} md={3} lg={2}>
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
      <Grid item xs={7} md={4} lg={3}>
        <PropertyTypeComboBox
          value={metadata.propertyType}
          onChange={handleMetadataChange}
        />
      </Grid>

      <Grid item xs={6} md={3} lg={2}>
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

        <Grid item xs={6} md={3} lg={2}>
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

        <Grid item xs={10} md={7} lg={6}>
          <AmenitiesTags
        selectedAmenities={metadata.amenities}
        onChange={handleAmenitiesChange}
      />
      </Grid>
    <Grid item xs={10} md={7} lg={6}>
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
      <Button onClick={handleSubmit}>Update Listing</Button>
      </Box>
  </form>
  </>
  )
}
