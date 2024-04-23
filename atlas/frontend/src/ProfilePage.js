import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsConfirmingPassword(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsConfirmingPassword(false);
    setEditedProfile(profile);
    setPassword('');
    setConfirmPassword('');
  };

  const handleInputChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordSubmit = async () => {
    if (password === confirmPassword) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/validate-password/',
          { password },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        if (response.data.valid) {
          setIsConfirmingPassword(false);
          setIsEditing(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          toast.error('Invalid password. Please try again.');
        }
      } catch (error) {
        console.error('Error validating password:', error);
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Passwords do not match. Please try again.');
    }
  };

  const handleApplyClick = async () => {
    try {
      await axios.put('http://localhost:8000/api/profile/', editedProfile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form-container">
        <h1 className="profile-heading">User Profile</h1>
        {profile ? (
          <div className="profile-form">
            {isConfirmingPassword ? (
              <>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="form-input"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="button-group">
                  <button onClick={handleConfirmPasswordSubmit} className="apply-button">
                    Confirm
                  </button>
                  <button onClick={handleCancelClick} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </>
            ) : isEditing ? (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    value={editedProfile.username}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="first_name"
                    value={editedProfile.first_name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="last_name"
                    value={editedProfile.last_name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="button-group">
                  <button onClick={handleApplyClick} className="apply-button">
                    Apply
                  </button>
                  <button onClick={handleCancelClick} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-details">
                  <p>Username: {profile.username}</p>
                  <p>Email: {profile.email}</p>
                  <p>First Name: {profile.first_name}</p>
                  <p>Last Name: {profile.last_name}</p>
                </div>
                <button onClick={handleEditClick} className="edit-button">
                  Edit
                </button>
              </>
            )}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;