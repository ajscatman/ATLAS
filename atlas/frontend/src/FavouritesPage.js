import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FavouritesPage.css';

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favourites/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setFavourites(response.data);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const showGameDetails = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="favourites-page">
      <h1 className="favourites-heading animated-element">My Favourites</h1>
      <h4 className="animated-element">Your own hall of fame where you keep your cherished titles.</h4>
      <div className="favourites-grid animated-element">
        {favourites.map((game) => (
          <div key={game.id} className="favourite-card" onClick={() => showGameDetails(game.id)}>
            <img src={game.cover.url} alt={game.name} />
            <h3>{game.name}</h3>
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

export default FavouritesPage;