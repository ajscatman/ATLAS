import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CollectionDetailsPage.css';

const CollectionDetailsPage = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

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
    const confirmDelete = window.confirm('Are you sure you want to delete this collection?');
    if (confirmDelete) {
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
    }
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-details-page">
      <h1 className="collection-title">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <button className="delete-button" onClick={deleteCollection}>Delete Collection</button>
      <h2 className="games-heading">Games</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id} className="game-item">
            <img src={game.cover} alt={game.name} />
            <div className="game-details">
              <h3>{game.name}</h3>
              <p>{game.summary}</p>
              <p>Genres: {game.genres}</p>
              <p>Platforms: {game.platforms}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionDetailsPage;