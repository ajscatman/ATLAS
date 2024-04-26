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

//   const handlePasswordChange = (e) => {
//     setEditedProfile({
//       ...editedProfile,
//       password: e.target.value,
//     });
//   };

//   const handleConfirmPasswordChange = (e) => {
//     setEditedProfile({
//       ...editedProfile,
//       confirmPassword: e.target.value,
//     });
//   };

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
      if (password && password !== confirmPassword) {
        toast.error('Passwords do not match. Please try again.');
        return;
      }
      const requestData = {
        ...editedProfile,
        ...(password && { password }),
      };
      await axios.put('http://localhost:8000/api/profile/', requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="profile-container animated-element">
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Password"
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            ): isEditing ?(
                <>
                <h2 className="profile-subheading">
                  Hi, {profile.first_name} {profile.last_name}!
                </h2>
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
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="New Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Confirm New Password"
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
            ):(
              <>
                <h2 className="profile-subheading">
                  Hi, {profile.first_name} {profile.last_name}!
                </h2>
                <div className="profile-details">
                  <p>Username: {profile.username}</p>
                  <p>Email: {profile.email}</p>
                </div>
                <button onClick={handleEditClick} className="edit-button">
                  Edit
                </button>
              </>
            )}
          </div>
        ):(
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;