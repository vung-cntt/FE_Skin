// PredictionsView.tsx
import React, { useState, useEffect } from 'react';
import { getPredictionsByUserId } from '../../api/getpredict';
import { Prediction } from '../../interfaces/models/getpredict';

const PredictionsView = () => {
  // Cập nhật state để sử dụng kiểu Prediction[]
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPredictionsByUserId()
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('An error occurred while fetching predictions:', error);
        setError('An error occurred while fetching predictions.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading predictions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>HISTORY</h2>
      <ul>
        {predictions.map((prediction) => (
          <li key={prediction.id}>
            Disease: {prediction.disease}, Confidence: {prediction.confidence},
            Time : {prediction.time}
            {/* Display additional fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictionsView;
