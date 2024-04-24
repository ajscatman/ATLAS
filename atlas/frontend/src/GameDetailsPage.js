import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GameDetailsPage.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${id}/`);
        const details = response.data;
        
        // Format the release date
        const releaseDate = details.first_release_date ? new Date(details.first_release_date).toLocaleDateString() : 'No release date';

        // Extract the genre and platform names
        const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : 'No genres listed';
        const platforms = details.platforms ? details.platforms.map(platform => platform.name).join(', ') : 'No platforms listed';

        // Use 'summary' instead of 'description' based on the API
        const summary = details.summary || 'No summary available.';

        setGameDetails({
          ...details,
          first_release_date: releaseDate,
          genres,
          platforms,
          summary,
        });
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (!gameDetails) {
    return <div>Loading game details...</div>;
  }

  return (
    <div className="game-details-page">
      {gameDetails.cover && <img src={gameDetails.cover} alt={`${gameDetails.name} cover`} className="game-cover-art" />}
      <h1 className="game-title">{gameDetails.name}</h1>
      <p><strong>Release Date:</strong> {gameDetails.first_release_date}</p>
      <p><strong>Genre:</strong> {gameDetails.genres}</p>
      <p><strong>Platforms:</strong> {gameDetails.platforms}</p>
      <p><strong>Summary:</strong> {gameDetails.summary}</p>
      <div className={`rating-box ${getRatingClass(gameDetails.rating)}`}>
        <strong>Rating:</strong> {gameDetails.rating ? gameDetails.rating.toFixed(2) : 'Not Rated'}
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

export default GameDetailsPage;