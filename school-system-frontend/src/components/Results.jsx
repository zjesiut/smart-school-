import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get('/results');
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Results</h1>
      <ul>
        {results.map(result => (
          <li key={result._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            Student: {result.student?.user?.name} - Course: {result.course?.name} - Grade: {result.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;