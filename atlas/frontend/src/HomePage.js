import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`http://localhost:8000/api/search/?query=${searchQuery}&type=${searchType}`);
        setSearchResults(response.data.results);
        if (response.data.results.length > 0) {
          toast.success('Search results found!');
        } else {
          toast.info('No search results found.');
        }
      } catch (error) {
        console.error('Error searching games:', error);
        toast.error('An error occurred while searching for games.');
      }
    }
  };

  const showGameDetails = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="home-page">
      <h1 className="animated-element">Welcome to ATLAS.</h1>
      <h4 className="animated-element">Search for your favourite games across our database and build your personalised collection.</h4>
      <div className="search-type-buttons animated-element">
        <button onClick={() => setSearchType('title')} className={searchType === 'title' ? 'active' : ''}>Title</button>
        <button onClick={() => setSearchType('developer')} className={searchType === 'developer' ? 'active' : ''}>Developer</button>
      </div>
      <div className="search-bar animated-element">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          placeholder={`Search by ${searchType}...`}
        />
      </div>
      <div className="game-grid">
        {searchResults.map((game) => (
          <div key={game.id} className="game-card animated-element" onClick={() => showGameDetails(game.id)}>
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