import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      {/* Optionally, you can add a button for immediate redirection */}
      <button onClick={() => navigate('/listings')}>Go to Listings</button>
    </div>
  );
};

export default ErrorPage;
