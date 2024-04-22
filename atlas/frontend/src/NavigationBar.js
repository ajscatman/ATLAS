import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return token !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <nav>
      <ul>
        {isAuthenticated() ? (
          <>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;