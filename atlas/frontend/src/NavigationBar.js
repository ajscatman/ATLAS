import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationBar.css';
import logo from './assets/atlaslogo.PNG';

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = location.state?.isAuthenticated || localStorage.getItem('accessToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { state: { isAuthenticated: false } });
  };

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link to="/home" className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/users" className="nav-link">Users</Link>
                </li>
                <li className="nav-item">
                  <Link to="/collections" className="nav-link">Collections</Link>
                </li>
                <li className="nav-item">
                  <Link to="/favorites" className="nav-link">Favorites</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
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