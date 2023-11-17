import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { Button, TextField } from '@mui/material';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

export default function LeaveReview (props) {
  const [hover, setHover] = React.useState(-1);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box
        sx={{
          width: 200,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Rating
          name="hover-feedback"
          value={props.value}
          precision={0.5}
          onChange={(event, newValue) => {
            props.setValue(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {props.value !== null && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : props.value]}</Box>
        )}
      </Box>
      <TextField
        fullWidth
        label="Leave a review here"
        id="fullWidth"
        onChange={(event) => props.setTextContent(event.target.value)}
        value={props.textContent}
        multiline
        rows={2}
      />
      <br/>
      <Button variant="outlined" sx={{
        display: 'flex',
        alignSelf: 'flex-end'
      }}
        onClick={props.handleSubmit}
      >Submit</Button>
    </Box>
  );
}
