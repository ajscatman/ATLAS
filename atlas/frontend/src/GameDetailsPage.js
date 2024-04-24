// GameDetailsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GameDetailsPage.css'; // Make sure to create a corresponding CSS file for this

const GameDetailsPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${id}/`);
        setGameDetails(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (!gameDetails) {
    return <div>Loading game details...</div>; // This will show until gameDetails is set
  }

  return (
    <div className="game-details-page">
      <div className="game-details-header">
        <img src={gameDetails.cover} alt={`${gameDetails.name} cover`} className="game-cover-art" />
        <h1 className="game-title">{gameDetails.name}</h1>
      </div>
      <div className="game-details-content">
        <p><strong>Release Date:</strong> {new Date(gameDetails.release_date).toLocaleDateString()}</p>
        <p><strong>Genre:</strong> {gameDetails.genres.join(', ')}</p>
        <p><strong>Platforms:</strong> {gameDetails.platforms.join(', ')}</p>
        <p><strong>Description:</strong> {gameDetails.description}</p>
        <p><strong>Storyline:</strong> {gameDetails.storyline}</p>
        <div className={`rating-box ${getRatingClass(gameDetails.rating)}`}>
          <strong>Rating:</strong> {gameDetails.rating ? gameDetails.rating.toFixed(2) : 'Not Rated'}
        </div>
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


































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const GameDetails = () => {
//   const { gameId } = useParams();
//   const [gameDetails, setGameDetails] = useState(null);

//   useEffect(() => {
//     const fetchGameDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/games/${gameId}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         });
//         setGameDetails(response.data);
//       } catch (error) {
//         console.error('Error fetching game details:', error);
//       }
//     };

//     fetchGameDetails();
//   }, [gameId]);

//   if (!gameDetails) {
//     return <div>Loading game details...</div>;
//   }

//   return (
//     <div>
//       <h2>{gameDetails.name}</h2>
//       <p>{gameDetails.summary}</p>
//       <p>Storyline: {gameDetails.storyline}</p>
//       <p>Developers: {gameDetails.developers.join(', ')}</p>
//       <p>Publishers: {gameDetails.publishers.join(', ')}</p>
//       <p>Aggregated Rating: {gameDetails.aggregated_rating}</p>
//       <p>Aggregated Rating Count: {gameDetails.aggregated_rating_count}</p>
//       <p>Genres: {gameDetails.genres.join(', ')}</p>
//       <p>Platforms: {gameDetails.platforms.join(', ')}</p>
//       <p>Release Dates: {gameDetails.release_dates.join(', ')}</p>
//       <div>
//         <h3>Screenshots:</h3>
//         {gameDetails.screenshots.map((screenshot, index) => (
//           <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameDetails;