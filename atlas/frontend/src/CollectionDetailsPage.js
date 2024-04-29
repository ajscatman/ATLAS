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
  const [isOwner, setIsOwner] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    fetchCollectionDetails();
    fetchCollectionGames();
    checkCollectionOwnership();
    fetchUpvoteStatus();
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

  const checkCollectionOwnership = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/collections/${collectionId}/check-ownership/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setIsOwner(response.data.is_owner);
    } catch (error) {
      console.error('Error checking collection ownership:', error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openEditModal = () => {
    setEditedTitle(collection.title);
    setEditedDescription(collection.description);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const updateCollection = async () => {
    try {
      await axios.put(`http://localhost:8000/api/collections/${collectionId}/`, {
        title: editedTitle,
        description: editedDescription,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      closeEditModal();
      fetchCollectionDetails();
      toast.success('Collection updated successfully!');
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('An error occurred while updating the collection.');
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
      toast.success('Collection deleted successfully!');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('An error occurred while deleting the collection.');
    }
  };

  const fetchUpvoteStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/collections/${collectionId}/upvote/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setIsUpvoted(response.data.is_upvoted);
      setUpvoteCount(response.data.upvote_count);
    } catch (error) {
      console.error('Error fetching upvote status:', error);
    }
  };

const toggleUpvote = async () => {
  try {
    const response = await axios.post(`http://localhost:8000/api/collections/${collectionId}/upvote/`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    setIsUpvoted(response.data.message === 'Upvote added');
    setUpvoteCount(response.data.upvote_count);
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error upvoting collection:', error);
    toast.error('An error occurred while upvoting the collection.');
  }
};

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-details-page">
      <h1 className="collection-title">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      {isOwner && (
        <>
          <button className="delete-button" onClick={openDeleteModal}>Delete Collection</button>
          <button className="edit-button" onClick={openEditModal}>Edit Collection</button>
        </>
      )}
      <h2 className="games-heading">Games <span className="upvote-score">Score: {upvoteCount}</span></h2>
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
      {!isOwner && (
        <button className="upvote-button" onClick={toggleUpvote}>
          {isUpvoted ? 'Downvote' : 'Upvote'}
        </button>
      )}
  
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
          <button onClick={deleteCollection} style={{ marginRight: '10px', backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
          <button onClick={closeDeleteModal} style={{ backgroundColor: '#ccc', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Collection"
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
        <h2>Edit Collection</h2>
        <input
          type="text"
          placeholder="Title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <textarea
          placeholder="Description"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        ></textarea>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={updateCollection} style={{ marginRight: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
          <button onClick={closeEditModal} style={{ backgroundColor: '#ccc', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionDetailsPage;