import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

// Common slider component for range selection
export default function RangeSlider (props) {
  return (
    <Box sx={{ width: 200 }}>
      <Slider
        getAriaLabel={() => 'Range'}
        value={props.value}
        onChange={(_, value) => props.setValue(value)}
        valueLabelDisplay="auto"
        getAriaValueText={props.range}
        min={props.min}
        max={props.max}
      />
    </Box>
  );
}
