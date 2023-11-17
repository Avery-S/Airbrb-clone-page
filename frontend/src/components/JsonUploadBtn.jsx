import React from 'react';
import Button from '@mui/material/Button';

// Upload json file button
export default function JsonUploadButton (props) {
  return (
    <div>
      <input
        accept="application/JSON"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={props.handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload JSON
        </Button>
      </label>
    </div>
  );
}
