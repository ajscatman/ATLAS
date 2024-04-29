import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';
import LoadingSpinner from './LoadingSpinner';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // This function, handleSearch, is an asynchronous function that is triggered when the 'Enter' key is pressed.
  // It sets a loading state to true, indicating that a search operation is in progress.
  // It then makes a GET request to a local search API, passing in a search query and search type as parameters.
  // The search results are then stored in state using the setSearchResults function.
  // If there are any results, a success message is displayed using the toast.success function.
  // If there are no results, an informational message is displayed using the toast.info function.
  // If an error occurs during the search operation, it is caught and logged to the console, and an error message is displayed to the user.
  // Finally, the loading state is set to false, indicating that the search operation has completed.
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setIsLoading(true);
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
      setIsLoading(false);
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
        <button onClick={() => setSearchType('developer')} className={searchType === 'developer' ? 'active' : ''}>Developer/Publisher</button>
      </div>
      <div className="search-container animated-element">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            placeholder={`Search by ${searchType}...`}
          />
        </div>
       {isLoading && <LoadingSpinner />}
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