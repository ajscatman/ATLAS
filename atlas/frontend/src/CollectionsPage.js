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
      <h4>This is where your curated collections are stored.</h4>
      <ul className="collection-list">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="collection-item-link"
          >
            <li className="collection-item">
              <span className="collection-title">{collection.title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsPage;