import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CollectionsPage.css';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/collections/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  return (
    <div className="collections-page">
      <h1 className="collections-heading">My Collections</h1>
      <ul className="collection-list">
        {collections.map((collection) => (
          <li key={collection.id} className="collection-item">
            <Link to={`/collections/${collection.id}`} className="collection-link">
              {collection.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsPage;