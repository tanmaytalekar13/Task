import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  // Prevent rendering children until token is verified
  if (!token) {
    return null; // Or a loading spinner if you prefer
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
