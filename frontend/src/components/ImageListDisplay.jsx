import React from 'react';
import { Grid, CardMedia, Box, useTheme, useMediaQuery } from '@mui/material';

export default function ImageListDisplay (props) {
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('md')); // Medium devices and up (laptops/desktops)
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Small to medium devices (tablets)
  const isPhone = useMediaQuery(theme.breakpoints.down('sm')); // Small devices (phones)

  let height;
  if (isLaptop) {
    height = '30vw'; // Adjust as needed for laptops/desktops
  } else if (isTablet) {
    height = '50vw'; // Adjust as needed for tablets
  } else if (isPhone) {
    height = '60vw'; // Adjust as needed for phones
  }

  const handleWheel = (e) => {
    const container = e.currentTarget;
    const containerScrollPosition = container.scrollLeft;
    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
      behaviour: 'smooth' // Optional: adds smooth scrolling
    });
  };
  return (
    <Box onWheel={handleWheel} sx={{
      overflowX: 'auto',
      display: 'flex',
      width: '100%',
      height: { height },
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch'
    }}>
      <Grid container spacing={1} component="div" sx={{ flexWrap: 'nowrap' }}>
        {props.images.map((image, index) => (
          <Grid item key={index}>
            <CardMedia
              component="img"
              image={image}
              alt={`Image ${index}`}
              sx={{ width: 'auto', height: '100%' }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
