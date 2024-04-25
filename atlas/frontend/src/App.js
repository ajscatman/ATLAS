import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import NavigationBar from './NavigationBar';
import ProfilePage from './ProfilePage';
import GameDetailsPage from './GameDetailsPage';
import FavoritesPage from './FavoritesPage';
import CollectionsPage from './CollectionsPage';
import CollectionDetailsPage from './CollectionDetailsPage';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return token !== null;
  };

  // Create a wrapper component for protected routes
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/game/:id" element={<ProtectedRoute><GameDetailsPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
          <Route path="/collections/:collectionId" element={<ProtectedRoute><CollectionDetailsPage /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
