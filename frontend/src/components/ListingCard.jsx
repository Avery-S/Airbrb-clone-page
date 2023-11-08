import * as React from 'react';
import Card from '@mui/material/Card';
import { CardContent, CardMedia, Typography } from '@mui/material';
// import Image from 'react-bootstrap/Image';
import userProfileImg from '../styles/userProfile1.png';

export default function ListingCard (props) {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      justifySelf: 'flex-start',
      width: props.cardWidth,
      minWidth: '200px',
      margin: '0.5vw',
    }}>
       <CardMedia
        component="img"
        image={userProfileImg} // Use the imported image
        alt="Thumbnail"
        sx={{
          height: '100%',
          aspectRatio: 1,
          objectFit: 'cover' // This will cover the card, cropping as necessary
        }}
      />
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Typography variant='h6'>Hello</Typography>
      </CardContent>
    </Card>
  );
}
