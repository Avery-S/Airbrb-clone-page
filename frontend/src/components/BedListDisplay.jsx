import React from 'react';
import { Grid, Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import { grey } from '@mui/material/colors';

export default function BedListDisplay (props) {
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('md')); // Medium devices and up (laptops/desktops)
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Small to medium devices (tablets)
  const isPhone = useMediaQuery(theme.breakpoints.down('sm')); // Small devices (phones)

  let width;
  if (isLaptop) {
    width = '13vw'; // Adjust as needed for laptops/desktops
  } else if (isTablet) {
    width = '20vw'; // Adjust as needed for tablets
  } else if (isPhone) {
    width = '30vw'; // Adjust as needed for phones
  }

  const getBedroomName = (roomType) => {
    switch (roomType) {
      case 'singleRoom':
        return 'Single Room';
      case 'twinRoom':
        return 'Twin Room';
      case 'familyRoom':
        return 'Family Room';
      case 'quadRoom':
        return 'Quad Room';
    }
    return roomType;
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
  console.log(Object.keys(props.bedrooms));
  if (!props.bedrooms) {
    return <>Loading...</>
  } else {
    return (
      <Box onWheel={handleWheel} sx={{
        // overflowX: 'auto',
        display: 'flex',
        width: '100%',
        height: 'fit-content',
        // scrollBehavior: 'smooth',
        // WebkitOverflowScrolling: 'touch',
      }}>
        <Grid container spacing={1} component="div" sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}>
          {Object.entries(props.bedrooms).map((bedroom, index) => (
            <Grid item key={index} width={width}>
              {bedroom.roomNum !== 0 && <Paper
                alt={`Bedroom ${index}`}
                sx={{
                  width: 'auto',
                  height: 'max-content',
                  display: 'flex',
                  flexDirection: 'column',
                  backGroundColor: grey[900],
                }}
                elevation={3}
              >
                <BedOutlinedIcon />
                <br />
                <Typography variant='h7'>
                  {bedroom[1].roomNum} {getBedroomName(Object.keys(props.bedrooms)[index])}
                </Typography>
                {/* <Typography variant='h7'>
                  No. of Room: {bedroom[1].roomNum}
                </Typography> */}
                <Typography variant='h7'>
                  {bedroom[1].beds} bed
                </Typography>
              </Paper>}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}
