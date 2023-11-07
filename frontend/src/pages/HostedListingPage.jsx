import React from 'react';
import checkToken from '../helper/checkToken';

// User Hosted Listings Page
export default function HostedListings (props) {
  checkToken(props.setToken);

  return (<>
    Hosted Listing Page
  </>);
}
