import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import './GameDetailsPage.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [userCollections, setUserCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  useEffect(() => {
    fetchGameDetails();
    checkFavoriteStatus();
    fetchUserCollections();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/games/${id}/`);
      const details = response.data;

      // Format the release date
      const releaseDate = details.first_release_date ? new Date(details.first_release_date * 1000).toLocaleDateString() : 'No release date';

      // Extract the genre and platform names
      const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : 'No genres listed';
      const platforms = details.platforms ? details.platforms.map(platform => platform.name).join(', ') : 'No platforms listed';

      const summary = details.summary || 'No summary available.';

      const videos = details.videos ? details.videos.map(video => ({
        videoId: video.video_id
      })) : [];

      const websites = details.websites ? details.websites.map(site => ({
        url: site.url
      })) : [];

      setGameDetails({
        ...details,
        first_release_date: releaseDate,
        genres,
        platforms,
        summary,
        videos,
        websites,
      });
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/check-favorite/?game_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/toggle-favorite/',
        { game_id: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const fetchUserCollections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/collections/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUserCollections(response.data);
    } catch (error) {
      console.error('Error fetching user collections:', error);
    }
  };

  const openCollectionModal = () => {
    setIsCollectionModalOpen(true);
  };

  const closeCollectionModal = () => {
    setIsCollectionModalOpen(false);
    setSelectedCollectionId('');
    setNewCollectionTitle('');
    setNewCollectionDescription('');
  };

  const addToCollection = async () => {
    if (selectedCollectionId) {
      try {
        await axios.post(`http://localhost:8000/api/collections/${selectedCollectionId}/games/`, {
          game_id: gameDetails.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        closeCollectionModal();
        fetchUserCollections(); // Fetch updated collections after adding the game
      } catch (error) {
        console.error('Error adding game to collection:', error);
      }
    } else if (newCollectionTitle) {
      try {
        const response = await axios.post('http://localhost:8000/api/collections/', {
          title: newCollectionTitle,
          description: newCollectionDescription,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const newCollectionId = response.data.id;
        await axios.post(`http://localhost:8000/api/collections/${newCollectionId}/games/`, {
          game_id: gameDetails.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        closeCollectionModal();
        fetchUserCollections();
      } catch (error) {
        console.error('Error creating new collection:', error);
      }
    }
  };

  if (!gameDetails) {
    return <div>Loading game details...</div>;
  }

  return (
    <div className="game-details-page">
      <div className="game-details-header">
        {gameDetails.cover && <img src={gameDetails.cover} alt={`${gameDetails.name} cover`} className="game-cover-art" />}
        <h1 className="game-title"><i>{gameDetails.name}</i></h1>
      </div>
      <div className="game-details-content">
        <p><strong>Release Date:</strong> {gameDetails.first_release_date}</p>
        <p><strong>Genre:</strong> {gameDetails.genres}</p>
        <p><strong>Platforms:</strong> {gameDetails.platforms}</p>
        <p><strong>Summary:</strong> {gameDetails.summary}</p>
        <div className={`rating-box ${getRatingClass(gameDetails.rating)}`} id="rating-box-2">
          <strong>Rating:</strong> {gameDetails.rating ? gameDetails.rating.toFixed(2) : 'Not Rated'}
        </div>
        <button className="add-to-favorites-button" onClick={toggleFavorite}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        <button className="add-to-collections-button" onClick={openCollectionModal}>Add to Collection</button>
      </div>
      <Modal
        isOpen={isCollectionModalOpen}
        onRequestClose={closeCollectionModal}
        contentLabel="Add to Collection"
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
        <h2>Add to Collection</h2>
        <select
          value={selectedCollectionId}
          onChange={(e) => setSelectedCollectionId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="">Select Collection</option>
          {userCollections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Collection Title"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <textarea
          placeholder="New Collection Description"
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        ></textarea>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={addToCollection} style={{ marginRight: '10px' }}>Add</button>
          <button onClick={closeCollectionModal}>Cancel</button>
        </div>
      </Modal>
      <div className="game-videos">
        <h2>Videos</h2>
        <div className="video-grid">
          {gameDetails.videos.map((video, index) => (
            <div key={index} className="video-item">
              <iframe
                title={`Video ${index}`}
                width="300"
                height="169"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>
      <div className="game-websites">
        <h2>Websites</h2>
        {gameDetails.websites.map((website, index) => (
          <a key={index} href={website.url} target="_blank" rel="noopener noreferrer">{website.url}</a>
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

export default GameDetailsPage;