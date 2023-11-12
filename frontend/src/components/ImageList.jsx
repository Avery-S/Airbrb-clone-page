import React from 'react';
import { Grid, CardMedia, Box } from '@mui/material';

const images = [
  // Add your image URLs here
  '../styles/defaultImg.jpg',
  '../styles/userProfile1.jpg',
];

export default function HorizontalImageList () {
  return (
    <Box sx={{ overflowX: 'auto', display: 'flex', width: '100%' }}>
      <Grid container spacing={2} component="div" sx={{ flexWrap: 'nowrap' }}>
        {images.map((image, index) => (
          <Grid item key={index}>
            <CardMedia
              component="img"
              image={image}
              alt={`Image ${index}`}
              // Customize the size as needed
              sx={{ width: 160, height: 90 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
