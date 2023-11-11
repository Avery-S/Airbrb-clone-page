import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

export default function SearchDrawer (props) {
  console.log(props.searchDrawerShow);
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      // onClick={props.toggleDrawer(false)}
      // onKeyDown={props.toggleDrawer(false)}
    >
      <List>
        Search Section
      </List>
      <Divider />
      <List>
        filter section
      </List>
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
