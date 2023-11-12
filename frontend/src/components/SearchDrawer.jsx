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

import CountrySelect from './SelectCountry';
import RangeSlider from './RangeSlider';
import { dateToString } from '../helper/helperFuncs';
import dayjs from 'dayjs';
import { blue } from '@mui/material/colors';

export default function SearchDrawer (props) {
  const [searchTitle, setSearchTitle] = React.useState('');
  const [searchCity, setSearchCity] = React.useState('');
  const [searchCountry, setSearchCountry] = React.useState('AU');
  const [searchBedNumRange, setSearchBedNumRange] = React.useState([0, 2]);
  const [searchStartDate, setSearchStartDate] = React.useState(dayjs());
  const [searchEndDate, setSearchEndDate] = React.useState(dayjs().add(2, 'day'));
  const [searchPriceRange, setSearchPriceRange] = React.useState([100, 200]);
  const [searchReviewRatingRange, setSearchReviewRatingRange] = React.useState([4, 5]);
  const [bedNumFilter, setbedNumFilter] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(false);
  const [priceFilter, setPriceFilter] = React.useState(false);
  const [reviewFilter, setReviewFilter] = React.useState(false);
  const [selectCountryDisabled, setSelectCountryDisabled] = React.useState(true);

  React.useEffect(() => {
    if (searchCity !== '') {
      setSelectCountryDisabled(false);
    } else {
      setSelectCountryDisabled(true);
    }
  }, [searchCity])

  // Check if the required date range falls within the availability range
  // TODO: date comparie
  const filterListingsByDate = (listings, requiredStartDate, requiredEndDate) => {
    console.log(requiredStartDate);
    return listings.filter(listing => {
      return listing.availability.some(availability => {
        console.log('here')
        console.log(dayjs(availability.startDate));
        return !requiredStartDate.isBefore(dayjs(availability.startDate).date()) && !requiredEndDate.isAfter(dayjs(availability.endDate).date());
      });
    });
  }

  const searchBy = () => {
    let newResultListings = [...props.publishedListings];
    console.log(`props.publishedListings: ${props.publishedListings}`);
    console.log(`props.resultListings: ${newResultListings}`);
    if (searchTitle !== '') {
      newResultListings = newResultListings.filter(listing => listing.title === searchTitle);
    }
    if (searchCity !== '') {
      newResultListings = newResultListings.filter(listing => listing.address.city === searchCity);
      if (searchCountry !== '') {
        newResultListings = newResultListings.filter(listing => listing.address.country === searchCountry);
      }
    }
    if (dateFilter) {
      if (searchStartDate.isAfter(searchEndDate)) {
        console.log(searchStartDate.isAfter(searchEndDate));
        props.setErrorModalMsg('Please enter a valid start/end date!');
        props.setErrorModalShow(true);
        return;
      } else {
        newResultListings = filterListingsByDate(newResultListings, searchStartDate, searchEndDate);
      }
    }
    props.setResultListings(newResultListings);
    props.setCurrentPage('search');
  }

  const fetchSearchResult = () => {
    console.log(searchTitle, searchCity, searchCountry);
    console.log(searchBedNumRange, dateToString(searchStartDate), dateToString(searchEndDate), searchPriceRange, searchReviewRatingRange);
    console.log(bedNumFilter, dateFilter, priceFilter, reviewFilter);
    if (searchTitle === '' && searchCity === '' && !dateFilter && !reviewFilter && !priceFilter && !bedNumFilter) {
      props.setErrorModalMsg('Please choose at least one field to search!');
      props.setErrorModalShow(true);
    } else {
      searchBy();
      props.setCurrentPage('search');
    }
    props.setSearchDrawerShow(false);
  }

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
            setSearchCountry={setSearchCountry}
            disabled={selectCountryDisabled}
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
              min={0}
              max={20}
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
                      value={searchStartDate}
                      onChange={(value) => setSearchStartDate(value.date())}
                    />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      label="End date picker"
                      value={searchEndDate}
                      onChange={(value) => setSearchEndDate(value.date())}
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
              max={5000}
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
