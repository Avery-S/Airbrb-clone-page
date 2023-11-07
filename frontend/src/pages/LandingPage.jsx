import React from 'react';
import { useNavigate } from 'react-router-dom';

// Landing page as "All listings page"
export default function LandingPage (props) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/')
  }, [])

  return (
  <>
    Landing Page
  </>);
}
