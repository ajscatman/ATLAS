import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './UserCollectionsPage.css';

const UserCollectionsPage = () => {
  const { userId } = useParams();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchUserCollections();
  }, [userId]);

  const fetchUserCollections = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${userId}/collections/`);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching user collections:', error);
    }
  };

  return (
    <div className="user-collections-page">
      <h1 className="animated-element user-collections-heading">User Collections</h1>
      <ul className="collection-list animated-element">
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

export default UserCollectionsPage;
