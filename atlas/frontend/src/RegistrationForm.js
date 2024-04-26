import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email,
        password,
        password2,
      });
      const { refresh, access, user } = response.data;
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Registration successful');
      toast.success('Registration successful');
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error.response);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="registration-container animated-element">
      <div className="registration-form-container">
        <h2 className="registration-heading">Register</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
            />
          </div>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="registration-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;