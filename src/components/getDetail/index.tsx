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
  const renderPredictionContent = () => {
    if (predictionDetail.data.disease === 'Error') {
      // Nếu disease là Error, hiển thị thông báo không phù hợp
      return (
        <span
          style={{
            fontSize: '15px',
            color: '#cc3300',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          }}
        >
          Ảnh không phù hợp, vui lòng kiểm tra lại !
        </span>
      );
    } else {
      // Nếu không, hiển thị chi tiết dự đoán
      return (
        <>
          <div
            style={{
              padding: '20px',
              height: '400px',
              rowGap: '8px',
              width: '600px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <hr />
            <div className="Title">
              <span>Overview</span>
              <span>BIM</span>
            </div>

            <div className="info-disease">
              <span>Prediction</span>{' '}
              <span>{predictionDetail.data.disease}</span>
            </div>
            <div className="info-disease">
              <span>Confidence</span>{' '}
              <span>{`${predictionDetail.data.confidence}`}</span>
            </div>
            <div className="info-disease">
              <span>Benign Moles</span>{' '}
              <span>{`${predictionDetail.data.benign_moles}`}</span>
            </div>
            <hr />
            <div className="Title">
              <span>AI detail results</span>
            </div>

            <div className="info-disease">
              <div style={{ justifyContent: 'space-between' }}>
                {Object.entries(predictionDetail.data.predictions)
                  .filter(([disease]) => disease !== 'Error')
                  .map(([disease]) => (
                    <div key={disease}>
                      <span>{disease}</span>
                    </div>
                  ))}
              </div>

              <div style={{ justifyContent: 'space-between' }}>
                {Object.entries(predictionDetail.data.predictions)
                  .filter(([value]) => value !== 'Error')
                  .map(([disease, value]) => (
                    <div key={disease}>
                      <span> {value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  // Render the detail content
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <h1>Prediction Detail</h1>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {/* Image container */}
        <div
          style={{
            width: '600px',
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Prediction results */}
        <div
          style={{
            height: '400px',
            width: '600px',
            display: 'flex',
            marginLeft: '200px',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '10px',
              overflowY: 'auto',
            }}
          >
            {renderPredictionContent()}
          </div>
        </div>
      </div>
    </BasePageContainer>
  );
};

export default GetDetailPredict;
