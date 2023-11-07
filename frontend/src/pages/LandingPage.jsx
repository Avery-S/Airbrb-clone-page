import React from 'react';
import { useNavigate } from 'react-router-dom';
import checkToken from '../helper/checkToken';

// Landing page as "All listings page"
export default function LandingPage (props) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/')
  }, [])

  checkToken(props.setToken);

  return (
  <>
    Landing Page
  </>);
}
