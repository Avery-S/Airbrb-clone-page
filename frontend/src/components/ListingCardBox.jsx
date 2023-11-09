import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box } from '@mui/material';
import ListingCard from './ListingCard';

// Box takes in a list of listings and display using ListingCard
export default function ListingCardBox (props) {
  // set gap and card width based on screen size
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const matchesLG = useMediaQuery(theme.breakpoints.down('lg'));
  const matchesXL = useMediaQuery(theme.breakpoints.down('xl'));

  let cardWidth;
  let gap;
  if (matchesSM) {
    cardWidth = '100%';
  } else if (matchesMD) {
    cardWidth = '31%';
    gap = '1%';
  } else if (matchesLG) {
    cardWidth = '31%';
    gap = '1%';
  } else if (matchesXL) {
    cardWidth = '23.4%';
    gap = '0.5%';
  } else {
    cardWidth = '22%';
    gap = '0.5%';
  }
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      paddingLeft: '4vw',
      paddingRight: '4vw',
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: '0',
      gap: { gap },
      rowGap: '1vw',
    }}>
      {/* Display listing card for each listing */}
      {props.listings.map(listing =>
        <ListingCard
          {...listing}
          key={listing.listingId}
          {...props}
          cardWidth={cardWidth}
          ifOwner={listing.owner === localStorage.getItem('userEmail')}
      />)}
    </Box>)
}
