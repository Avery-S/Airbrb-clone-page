import { useEffect } from 'react';

// update the token when refresh the page
export default function checkToken (setToken) {
  useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if (checkToken !== null && checkToken !== '') {
      setToken(checkToken);
    }
  }, []);
}
