import { BreadcrumbProps, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import React, { useState, useEffect } from 'react';
import { predict, store, getUserInfo } from '../../api/predict';
import './index.css';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.predict,
      title: <Link to={webRoutes.predict}>Predict</Link>,
    },
  ],
};

const Predict = () => {
  const [imageSrc, setImageSrc] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    disease: string;
    confidence: string;
    benign_moles: string;
    predictions: {
      [key: string]: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUsername(userInfo.user_name);
        setUserId(userInfo.idUser);
        localStorage.setItem('username', userInfo.user_name);
        localStorage.setItem('uid', userInfo.idUser);
        // Lưu username vào localStorage
      } catch (error) {
        console.error('An error occurred while fetching user info:', error);
      }
    };

    // Lấy username từ localStorage khi component được render
    const savedUsername = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('uid');
    if (savedUsername && savedUserId) {
      setUsername(savedUsername);
      setUserId(savedUserId);
    } else {
      fetchUserInfo();
    }
  }, [username, userId]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;
    const reader = new FileReader();

    reader.onloadend = () => {
      // Chỉ cập nhật state nếu kết quả là một chuỗi
      if (typeof reader.result === 'string') {
        setImageSrc(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
      setFile(file);
      setResult(null);
    }
    e.target.value = null;
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      if (file) {
        const imageBlob = new Blob([file], { type: file.type });

        const formData = new FormData();
        formData.append('file', imageBlob, file.name); // Thêm Blob vào formData

        const predictionResult = await predict(formData); // Gửi formData đến API
        setResult(predictionResult);

        if (predictionResult.disease === 'Error') {
          setResult({
            disease: 'Ảnh không phù hợp, vui lòng kiểm tra lại',
            confidence: '',
            benign_moles: '',
            predictions: {},
          });
        } else {
          setResult(predictionResult);
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = async () => {
          const base64data = reader.result;

          const data = {
            image: base64data, // Lưu trữ ảnh dưới dạng Base64
            disease: predictionResult.disease,
            confidence: predictionResult.confidence,
            benign_moles: predictionResult.benign_moles,
            predictions: predictionResult.predictions,
            time: new Date().toISOString(),
            userId: userId,
            username: username,
          };

          const storeResponse = await store(data);
          console.log(storeResponse.status);
        };
      }
    } catch (error) {
      console.error('An error occurred during prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    // setImageUploaded(false);
    setImageSrc('');
    setResult(null);
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div>
        <h1>Skin Cancer Detection</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '600px',
              height: '400px',
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Uploaded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            )}
            <input
              type="file"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
              onChange={handleImageUpload}
            />
            {!imageSrc && (
              <p
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                  textAlign: 'center',
                  color: 'grey',
                  pointerEvents: 'none',
                  transform: 'translateY(-50%)',
                }}
              >
                Click here to add an image
              </p>
            )}
          </div>
          <div>
            {result && file && (
              <div
                style={{
                  padding: '20px',
                  height: '400px',

                  width: '600px',
                  display: 'flex',
                  marginRight: '150px',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {result.confidence ? (
                  <>
                    <hr />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '10px',
                        overflowY: 'auto',
                      }}
                    >
                      <div className="Title">
                        <span>Overview</span>
                        <span>BIM</span>
                      </div>
                      <div className="info-disease">
                        <span>Prediction:</span>
                        <span>{result.disease}</span>
                      </div>
                      <div className="info-disease">
                        <span>Confidence:</span>{' '}
                        <span>{result.confidence}</span>
                      </div>
                      <div className="info-disease">
                        <span>Benign Moles:</span>{' '}
                        <span>{result.benign_moles}</span>
                      </div>
                      <hr />
                      <div className="Title">
                        <span>AI detail results</span>
                      </div>
                      <div className="info-disease">
                        <div style={{ justifyContent: 'space-between' }}>
                          {Object.entries(result.predictions)
                            .filter(([disease]) => disease !== 'Error')
                            .map(([disease]) => (
                              <div key={disease}>
                                <span>{disease}</span>
                              </div>
                            ))}
                        </div>

                        <div style={{ justifyContent: 'space-between' }}>
                          {Object.entries(result.predictions)
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
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#cc3300',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                      }}
                    >
                      <p>{result.disease}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Button
            className="button"
            type="primary"
            onClick={handlePredict}
            loading={loading}
          >
            Predict
          </Button>
          <Button className="button" type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        {loading && <Spin />}
      </div>
    </BasePageContainer>
  );
};

export default Predict;
