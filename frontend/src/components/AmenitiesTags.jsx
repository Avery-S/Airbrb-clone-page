import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function AmenitiesTags ({ selectedAmenities, onChange }) {
  return (
    // spacing={3} sx={{ width: 300 }}
    <Stack >
      <Autocomplete
        multiple
        id="tags-outlined"
        options={amenities}
        getOptionLabel={(option) => option.title}
        value={selectedAmenities.map((amenity) => amenities.find(a => a.title === amenity))}
        onChange={(event, newValue) => {
          onChange(newValue.map((item) => item.title));
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Amenities"
            placeholder="Select amenities"
          />
        )}
      />
    </Stack>
  );
}

const amenities = [
  { title: 'Free WI-FI' },
  { title: 'Car Parking' },
  { title: 'Fitness center' },
  { title: 'Breakfast' },
  { title: 'Brunch' },
  { title: 'Lunch' },
  { title: 'Restaurant' },
  { title: 'Bar' },
  { title: 'Sauna' },
  { title: 'Balcony/Terrace' },
  { title: 'Express check-in/check-out' },
  { title: 'Room service' },
  { title: 'Wheelchair accessible' },
];
