import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// toggle to choose the sort order
export default function ReviewSortToggle (props) {
  const handleChange = (event, newAlignment) => {
    props.setReviewSort(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={props.reviewSort}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="Alphabetical">Alphabetical</ToggleButton>
      <ToggleButton value="Ascending">Ascending</ToggleButton>
      <ToggleButton value="Descending">Descending</ToggleButton>
    </ToggleButtonGroup>
  );
}
