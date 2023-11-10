import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function PropertyTypeComboBox ({ value, onChange }) {
  return (
    <Autocomplete
      disablePortal
      id="propertyType"
      options={propertyType}
      value={propertyType.find(option => option.label === value)}
      onChange={(event, newValue) => {
        onChange({ target: { id: 'propertyType', value: newValue?.label || '' } });
      }}
      // sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Property Type" />}
    />
  );
}

const propertyType = [
  { label: 'Apartment' },
  { label: 'House' },
  { label: 'Villa' },
  { label: 'Condominium' },
  { label: 'Loft' },
  { label: 'Cottage' },
];
