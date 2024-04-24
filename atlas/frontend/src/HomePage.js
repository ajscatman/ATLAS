import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/search/?query=${searchQuery}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching games:', error);
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search games..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="game-grid">
        {searchResults.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.cover} alt={game.name} />
            <h3>{game.name}</h3>
            <p className={getRatingClass(game.rating)}>
              Rating: {typeof game.rating === 'number' ? game.rating.toFixed(2) : 'Not Rated'}
            </p>
            <p><b>Developers: </b>{game.developers.join(', ')}</p>
            {/* <p>Publishers: {game.publishers.join(', ')}</p> */}
            <p><b>Available on: </b>{game.platforms.join(', ')}</p>
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