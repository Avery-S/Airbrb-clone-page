import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function PropertyTypeComboBox ({ value, onChange }) {
  const selectedValue = value ? propertyType.find(option => option.label === value) : null;
  return (
    <Autocomplete
      disablePortal
      id="propertyType"
      options={propertyType}
      value={selectedValue}
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
