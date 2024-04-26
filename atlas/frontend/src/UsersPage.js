import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UsersPage.css';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`http://localhost:8000/api/search-users/?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  };

  const showUserCollections = (userId) => {
    navigate(`/users/${userId}/collections`);
  };

  return (
    <div className="users-page">
      <h1 className="animated-element">Users</h1>
      <h4 className="animated-element">Search for users on ATLAS and see what game collections they've made.</h4>
      <div className="search-bar animated-element">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          placeholder="Search users..."
        />
      </div>
      <ul className="user-list">
        {searchResults.map((user) => (
          <li key={user.id} className="user-item" onClick={() => showUserCollections(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;