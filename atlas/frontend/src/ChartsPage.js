import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChartsPage.css';

const ChartsPage = () => {
  const [topCollections, setTopCollections] = useState([]);

  useEffect(() => {
    fetchTopCollections();
  }, []);

  const fetchTopCollections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/top-collections/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setTopCollections(response.data);
    } catch (error) {
      console.error('Error fetching top collections:', error);
    }
  };

  return (
    <div className="charts-page">
      <h1 className="charts-heading animated-element">Top Collections</h1>
      <h4 className="animated-element">Discover the most upvoted collections on ATLAS.</h4>
      <h6 className="animated-element">Minimum score requirement (3)</h6>
      <ul className="collection-list animated-element">
        {topCollections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="collection-item-link"
          >
            <li className="collection-item">
              <span className="collection-title">{collection.title}</span>
              <span className="collection-score">Score: {collection.upvote_count}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ChartsPage;