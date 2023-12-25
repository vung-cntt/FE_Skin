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
        const formData = new FormData();
        formData.append('file', file); // Thêm file vào formData

        const predictionResult = await predict(formData); // Gửi formData đến API
        setResult(predictionResult);

        // Gửi dữ liệu đến API MongoDB
        const data = {
          image: file as Blob,
          disease: predictionResult.disease,
          confidence: predictionResult.confidence,
          time: new Date().toISOString(),
          userId: userId,
          username: username, // Thay đổi 'username' này thành tên người dùng thực tế
        };

        const storeResponse = await store(data);
        console.log(storeResponse.status);
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
            width: '400px',
            height: '400px',
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Uploaded"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          )}
          <input type="file" onChange={handleImageUpload} />
        </div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={handlePredict} loading={loading}>
            Predict
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        {loading && <Spin />}

        {result && file && (
          <div>
            <h2>Results</h2>
            <div style={{ display: 'flex' }}>
              <div>
                <p>Prediction: {result.disease}</p>
                <p>Confidence: {result.confidence}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </BasePageContainer>
  );
};

export default Predict;
