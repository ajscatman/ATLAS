import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 20;

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/search/?query=${searchQuery}&page=${currentPage}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching games:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(searchResults.count / gamesPerPage);
  const displayedGames = searchResults.results || [];

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
        {displayedGames.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.cover} alt={game.name} />
            <h3>{game.name}</h3>
          </div>
        ))}
      </div>
      <div className="pagination">
      {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
    </div>
    </div>
  );
};

export default HomePage;