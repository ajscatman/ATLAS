import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationBar.css';

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
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {isAuthenticated() && (
          <Link to="/home" className="navbar-brand">Home</Link>
        )}
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav ml-auto">
            {isAuthenticated() ? (
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;