import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('title'); // Can be 'title' or 'developer'
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/search/?query=${searchQuery}&type=${searchType}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching games:', error);
    }
  };

  const showGameDetails = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <div className="search-type-buttons">
        <button onClick={() => setSearchType('title')} className={searchType === 'title' ? 'active' : ''}>Title</button>
        <button onClick={() => setSearchType('developer')} className={searchType === 'developer' ? 'active' : ''}>Developer</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${searchType}...`}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="game-grid">
        {searchResults.map((game) => (
          <div key={game.id} className="game-card" onClick={() => showGameDetails(game.id)}>
            <img src={game.cover} alt={game.name} />
            <div style={{ minHeight: '70px' }}>
              <h3>{game.name}</h3>
            </div>
            <div className={`rating-box ${getRatingClass(game.rating)}`}>
              Rating: {typeof game.rating === 'number' ? game.rating.toFixed(2) : 'Not Rated'}
            </div>
            <p>Developers: {game.developers.join(', ')}</p>
            <p>Publishers: {game.publishers.join(', ')}</p>
            <p>Available on: {game.platforms.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function getRatingClass(rating) {
  if (rating >= 70) {
    return 'rating-green';
  } else if (rating >= 40) {
    return 'rating-orange';
  } else if (rating < 40) {
    return 'rating-red';
  } else {
    return '';
  }
}

export default HomePage;