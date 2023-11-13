import React from 'react'
import { useParams } from 'react-router-dom';
import { Box, Typography, Rating, Divider, Chip, useTheme, useMediaQuery, Button } from '@mui/material';

import { BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import ImageListDisplay from '../components/ImageListDisplay';
import { getUserRating } from '../helper/helperFuncs';
// import BedListDisplay from '../components/BedListDisplay';

export default function ListingDetailPage (props) {
  const [listingInfo, setListingInfo] = React.useState([]);

  console.log(props)
  const { listingId } = useParams();
  console.log(listingId);

  React.useEffect(() => {
    getListingInfo();
  }, []);

  const getListingInfo = async () => {
    const response = await fetch(`${BACKEND_URL}/listings/${listingId}`, fetchObject('GET', {}, false));
    const data = await response.json();
    if (data.error) {
      props.setErrorModalMsg(data.error);
      props.setErrorModalShow(true);
    } else {
      setListingInfo(data.listing);
      console.log(listingInfo);
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
        <ImageListDisplay />
        {/* Content */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: '2vw',
          justifyContent: 'space-between'
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifySelf: 'flex-start',
            flex: '0.7'
          }}>
            <Typography variant='h4'>{ listingInfo.title }</Typography>
            <Typography variant='h6' fontWeight={1}>
              { Object.values(listingInfo.address).join(', ') }
            </Typography>
            <br />
            {reviewLength === 0
              ? (<Typography variant='subtitle2'> No Reviews </Typography>)
              : (<>
                <Rating name="user-rating" defaultValue={userRating} precision={0.1} readOnly />
                <Typography variant='subtitle2'>{reviewLength} reviews</Typography>
              </>)}
            <Divider>
              <Chip label="ROOMS" />
            </Divider>
            <Typography variant='subtitle2'>
              No. of Beds: {listingInfo.metadata.numberOfBeds}
            </Typography>
            <Typography variant='subtitle2'>
              No. of Baths: {listingInfo.metadata.numberOfBathrooms}
            </Typography>
            {/* <BedListDisplay bedrooms={listingInfo.metadata.rooms} /> */}
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
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            flex: '0.3',
          }}
          >
            <Button variant="contained" sx={{
              display: 'flex',
              height: 'min-content',
            }} >Book</Button>
          </Box>
        </Box>
      </Box>
    );
  }
}
