import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CollectionDetailsPage.css';

const CollectionDetailsPage = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedGame, setDraggedGame] = useState(null);

  useEffect(() => {
    fetchCollectionDetails();
    fetchCollectionGames();
  }, [collectionId]);

  const fetchCollectionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/collections/${collectionId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setCollection(response.data);
    } catch (error) {
      console.error('Error fetching collection details:', error);
    }
  };

  const fetchCollectionGames = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/collections/${collectionId}/games/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const gameIds = response.data.map((game) => game.game_id);
      const gameDetailsResponse = await axios.get(`http://localhost:8000/api/games/?ids=${gameIds.join(',')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setGames(gameDetailsResponse.data);
    } catch (error) {
      console.error('Error fetching collection games:', error);
    }
  };

  const deleteCollection = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/collections/${collectionId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      navigate('/collections');
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleDragStart = (game) => {
    setIsDragging(true);
    setDraggedGame(game);
  };

  const handleDragOver = (e, game) => {
    e.preventDefault();
    if (draggedGame !== game) {
      const updatedGames = [...games];
      const draggedIndex = updatedGames.findIndex((g) => g.id === draggedGame.id);
      const targetIndex = updatedGames.findIndex((g) => g.id === game.id);
      updatedGames.splice(draggedIndex, 1);
      updatedGames.splice(targetIndex, 0, draggedGame);
      setGames(updatedGames);
    }
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedGame(null);

    try {
      await axios.put(
        `http://localhost:8000/api/collections/${collectionId}/games/reorder/`,
        {
          games: games.map((game, index) => ({ id: game.id, order: index })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error reordering games:', error);
    }
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-details-page">
      <h1 className="collection-title">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <button onClick={deleteCollection} className="delete-button">
        Delete Collection
      </button>
      <h2>Games</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li
            key={game.id}
            className="game-item"
            draggable
            onDragStart={() => handleDragStart(game)}
            onDragOver={(e) => handleDragOver(e, game)}
            onDragEnd={handleDragEnd}
          >
            <img src={game.cover} alt={game.name} />
            <h3>{game.name}</h3>
            <p>{game.summary}</p>
            <div className={`rating-box ${getRatingClass(game.rating)}`}>
              Rating: {game.rating ? game.rating.toFixed(2) : 'Not Rated'}
            </div>
            <p>Genres: {game.genres}</p>
            <p>Platforms: {game.platforms}</p>
          </li>
        ))}
      </ul>
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

export default CollectionDetailsPage;