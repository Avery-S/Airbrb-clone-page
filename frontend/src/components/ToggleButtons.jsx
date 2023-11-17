import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

// Toggle button to manage bookings
function ToggleButtons ({ onAccept, onDecline, status }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleClick = (button) => {
    setSelectedButton(button);
    if (button === 'accept') {
      onAccept();
    } else if (button === 'decline') {
      onDecline();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {(status === 'pending' || status === null) && (
        <>
          {!selectedButton && (
            <>
              <Button
                variant="outlined"
                color="success"
                onClick={() => handleClick('accept')}
                sx={{ width: '100px', mr: 2 }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleClick('decline')}
                sx={{ width: '100px' }}
              >
                Decline
              </Button>
            </>
          )}
          {selectedButton === 'accept' && (
            <Button
              variant="contained"
              color="success"
              disabled
              sx={{ width: '100px' }}
            >
              Accepted
            </Button>
          )}
          {selectedButton === 'decline' && (
            <Button
              variant="outlined"
              color="error"
              disabled
              sx={{ width: '100px', bgcolor: 'action.disabledBackground' }}
            >
              Declined
            </Button>
          )}
        </>
      )}
      {status === 'accepted' && (
        <Button
          variant="contained"
          color="success"
          sx={{ width: '100px' }}
        >
          Accepted
        </Button>
      )}
      {status === 'declined' && (
        <Button
          variant="outlined"
          color="error"
          disabled
          sx={{ width: '100px', bgcolor: 'action.disabledBackground' }}
        >
          Declined
        </Button>
      )}
    </Box>
  );
}

export default ToggleButtons;
