import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      const { refresh, access } = response.data;
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('Login successful');
      toast.success('Login successful');
      navigate('/home', { state: { isAuthenticated: true } });
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    }
  };

  return (
    <div className="login-container animated-element">
      <div className="login-form-container">
        <h2 className="login-heading">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;