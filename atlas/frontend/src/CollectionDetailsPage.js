import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './CollectionDetailsPage.css';
import { toast } from 'react-toastify';

const CollectionDetailsPage = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteCollection = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/collections/${collectionId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      navigate('/collections');
      toast.success('Collection deleted successfully!');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('An error occurred while deleting the collection.');
    }
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-details-page">
      <h1 className="collection-title">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <button className="delete-button" onClick={openDeleteModal}>Delete Collection</button>
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

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Collection"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <h2>Delete Collection</h2>
        <p>Are you sure you want to delete this collection?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={deleteCollection} style={{ marginRight: '10px' }}>Delete</button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionDetailsPage;