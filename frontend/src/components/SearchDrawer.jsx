import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { TextField, Typography, Switch } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import CountrySelect from './CountrySelect';
import RangeSlider from './RangeSlider';
import dayjs from 'dayjs';
import { blue } from '@mui/material/colors';
import ReviewSortToggle from './ReviewSortToggle';

export default function SearchDrawer (props) {
  const [searchTitle, setSearchTitle] = React.useState('');
  const [searchCity, setSearchCity] = React.useState('');
  const [searchCountry, setSearchCountry] = React.useState('');
  const [searchBedNumRange, setSearchBedNumRange] = React.useState([1, 2]);
  const [searchStartDate, setSearchStartDate] = React.useState(dayjs());
  const [searchEndDate, setSearchEndDate] = React.useState(dayjs().add(2, 'day'));
  const [searchPriceRange, setSearchPriceRange] = React.useState([100, 200]);
  const [searchReviewRatingRange, setSearchReviewRatingRange] = React.useState([4, 5]);
  const [bedNumFilter, setbedNumFilter] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(false);
  const [priceFilter, setPriceFilter] = React.useState(false);
  const [reviewFilter, setReviewFilter] = React.useState(false);
  const [selectCountryDisabled, setSelectCountryDisabled] = React.useState(true);
  const [reviewSort, setReviewSort] = React.useState('Alphabetical');

  // enable/disable city search area based on city value
  React.useEffect(() => {
    if (searchCity !== '') {
      setSelectCountryDisabled(false);
    } else {
      setSelectCountryDisabled(true);
    }
  }, [searchCity])

  const handleCountryChange = (event, newValue) => {
    setSearchCountry(newValue);
  };

  // Check if the required date range falls within the availability range
  const filterListingsByDate = (listings, requiredStartDate, requiredEndDate) => {
    return listings.filter(listing => {
      return listing.availability.some(availability => {
        return !requiredStartDate.isBefore(dayjs(availability.startDate), 'date') && !requiredEndDate.isAfter(dayjs(availability.endDate), 'date');
      });
    });
  }

  // filter the result listings
  const searchBy = () => {
    let newResultListings = [...props.publishedListings];
    if (searchTitle !== '') {
      newResultListings = newResultListings.filter(listing => listing.title.toLowerCase() === searchTitle.toLowerCase().trim());
    }
    if (searchCity !== '') {
      newResultListings = newResultListings.filter(listing => listing.address.city.toLowerCase() === searchCity.toLowerCase().trim());
      if (searchCountry !== '') {
        newResultListings = newResultListings.filter(listing => listing.address.country === searchCountry);
      }
    }
    if (dateFilter) {
      if (searchStartDate.isAfter(searchEndDate, 'date')) {
        props.setErrorModalMsg('Please enter a valid start/end date!');
        props.setErrorModalShow(true);
        return;
      } else {
        newResultListings = filterListingsByDate(newResultListings, searchStartDate, searchEndDate);
        props.setSearchDateRange([searchStartDate, searchEndDate]);
      }
    }
    if (!dateFilter) {
      props.setSearchDateRange([]);
    }
    if (bedNumFilter) {
      newResultListings = newResultListings.filter(listing => {
        return parseInt(listing.metadata.numberOfBeds) >= searchBedNumRange[0] &&
          parseInt(listing.metadata.numberOfBeds) <= searchBedNumRange[1]
      })
    }
    if (priceFilter) {
      newResultListings = newResultListings.filter(listing => {
        return parseInt(listing.price) >= searchPriceRange[0] &&
          parseInt(listing.price) <= searchPriceRange[1]
      })
    }
    if (reviewFilter) {
      newResultListings = newResultListings.filter(listing => {
        return parseFloat(listing.userRating) >= searchReviewRatingRange[0] &&
          parseInt(listing.userRating) <= searchReviewRatingRange[1]
      })
    }
    switch (reviewSort) {
      case 'Alphabetical':
        newResultListings = newResultListings.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Ascending':
        newResultListings = newResultListings.sort((a, b) => a.userRating - b.userRating);
        break;
      case 'Descending':
        newResultListings = newResultListings.sort((a, b) => b.userRating - a.userRating);
        break;
    }
    props.setResultListings(newResultListings);
    props.setCurrentPage('search');
  }

  // set the search result listings
  const fetchSearchResult = () => {
    if (searchTitle === '' && searchCity === '' && !dateFilter && !reviewFilter && !priceFilter && !bedNumFilter) {
      props.setErrorModalMsg('Please choose at least one field to search!');
      props.setErrorModalShow(true);
    } else {
      searchBy();
      props.setCurrentPage('search');
    }
    props.setSearchDrawerShow(false);
  }

  // drawer for choose search/filter options
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h6'>Search By</Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            label="Title of the listing"
            id="filled-start-adornment"
            sx={{ m: 1, width: '25ch' }}
            variant="filled"
            onChange={event => setSearchTitle(event.target.value)}
          />
          <TextField
            label="City"
            id="filled-start-adornment"
            sx={{ m: 1, width: '25ch' }}
            variant="filled"
            onChange={event => setSearchCity(event.target.value)}
          />
          <CountrySelect
            disabled={selectCountryDisabled}
            value={searchCountry}
            onChange={handleCountryChange}
          />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h6'>Filter By</Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <br/>
          {/* bedroom number range filter */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <RangeSlider
              value={searchBedNumRange}
              setValue={setSearchBedNumRange}
              min={1}
              max={10}
            />
            <Switch
              checked={bedNumFilter}
              onChange={(event) => setbedNumFilter(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography color={blue[800]} variant='h7'>No. of Beds</Typography>
          </Box>
          {/* Date range filter */}
          <Box sx={{ display: 'flex', flexDirection: 'row', }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: '2',
              alignItems: 'center'
            }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      label="Start date picker"
                      value={dayjs(searchStartDate)}
                      onChange={(value) => setSearchStartDate(value)}
                    />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      label="End date picker"
                      value={dayjs(searchEndDate)}
                      onChange={(value) => setSearchEndDate(value)}
                    />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Switch
              checked={dateFilter}
              onChange={(event) => setDateFilter(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography color={blue[800]} variant='h7'>Date</Typography>
          </Box>
          <br/>
          {/* Price range filter */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <RangeSlider
              value={searchPriceRange}
              setValue={setSearchPriceRange}
              min={0}
              max={2000}
            />
            <Switch
              checked={priceFilter}
              onChange={(event) => setPriceFilter(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography color={blue[800]} variant='h7'>Price</Typography>
          </Box>
          <br/>
          {/* Review rating range filter */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <RangeSlider
              value={searchReviewRatingRange}
              setValue={setSearchReviewRatingRange}
              min={0}
              max={5}
            />
            <Switch
              checked={reviewFilter}
              onChange={(event) => setReviewFilter(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography color={blue[800]} variant='h7'>Review</Typography>
          </Box>
        </Box>
        <Typography variant='h6'>Sort Review By</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <ReviewSortToggle setReviewSort={setReviewSort} reviewSort={reviewSort} />
        </Box>
        <Button
         variant="contained"
          sx={{ display: 'flex', alignSelf: 'flex-end' }}
         onClick={fetchSearchResult}
       >Search</Button>
      </Box>
    </Box>
  );

  return (
    <div>
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={props.toggleDrawer(true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={props.searchDrawerShow}
            onClose={props.toggleDrawer(false)}
            onOpen={props.toggleDrawer(true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
