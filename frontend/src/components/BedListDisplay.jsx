import React from 'react';
import { Grid, Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';

export default function BedListDisplay (props) {
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
        {props.bedroomList.map((bedroom, index) => (
          <Grid item key={index}>
            <Box
              alt={`Bedroom ${index}`}
              sx={{ width: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <BedOutlinedIcon />
              <br />
              <Typography variant='h7'>
                {Object.keys(props.bedroomList)[index]}
              </Typography>
              <Typography variant='h7'>
                No. of Room: {bedroom.roomNum}
              </Typography>
              <Typography variant='h7'>
                No. of Beds: {bedroom.beds}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
