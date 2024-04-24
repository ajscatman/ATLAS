import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const showGameDetails = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="favorites-page">
      <h1 className="favorites-heading animated-element">My Favorites</h1>
      <div className="game-grid">
        {favorites.map((game) => (
          <div key={game.id} className="game-card animated-element" onClick={() => showGameDetails(game.id)}>
            <img src={game.cover.url} alt={game.name} />
            <div>
              <h3>{game.name}</h3>
              <div className={`rating-box ${getRatingClass(game.rating)}`}>
                Rating: {game.rating ? game.rating.toFixed(2) : 'Not Rated'}
              </div>
            </div>
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

export default FavoritesPage;