import React from 'react';
import { useNavigate } from 'react-router-dom';

// The page to show route error and redirect to all listing page
const ErrorPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to /listings after 3 seconds
    const timer = setTimeout(() => navigate('/'), 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>404: Page Not Found</h1>
      <p>Redirecting to listings...</p>
      <button onClick={() => navigate('/listings')}>Go to Listings</button>
    </div>
  );
};

export default ErrorPage;
