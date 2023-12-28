import React, { useState, useEffect } from 'react';
import { BreadcrumbProps, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import { getDetailPreidct } from '../../api/predict';
import { PredictionDetail } from '../../interfaces/models/getdetailpredict';
import './index.css';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.getDetail,
      title: <Link to={webRoutes.getDetail}>Predict Detail</Link>,
    },
  ],
};

const GetDetailPredict = () => {
  const { id } = useParams();
  const [predictionDetail, setPredictionDetail] =
    useState<PredictionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch prediction detail using an async arrow function
  const fetchPredictionDetail = async (predictionId: string) => {
    try {
      setLoading(true);
      const data = await getDetailPreidct(predictionId);
      setPredictionDetail(data);
      setError(null);
    } catch (err) {
      console.error('Error when fetching prediction details:', err);
      setError('Failed to load prediction details');
    } finally {
      setLoading(false);
    }
  };

  // Call the fetch function when the component mounts
  useEffect(() => {
    if (id) {
      fetchPredictionDetail(id);
    }
  }, [id]);

  // Conditional rendering based on loading and error state
  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!predictionDetail) {
    return <p>No prediction details available.</p>;
  }
  console.log(predictionDetail, 'vững đỉnh vãi lon');
  // Render the detail content
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <h1>Prediction Detail</h1>
      <div>
        {/* Image container */}
        <div
          style={{
            width: '400px',
            height: '400px',
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <img
            src={predictionDetail.data.image}
            alt="Uploaded"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>

        {/* Prediction results */}
        <div>
          <h2>Result</h2>
          <p>Prediction: {predictionDetail.data.disease}</p>
          <p>Confidence: {predictionDetail.data.confidence}</p>
        </div>
      </div>
    </BasePageContainer>
  );
};

export default GetDetailPredict;
