import { BreadcrumbProps, Button, Spin, Upload, Image, UploadFile } from 'antd';
import { Link } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import React, { useState } from 'react';
import { predict, store } from '../../api/predict';
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
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    disease: string;
    confidence: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const handleFileChange = (files: UploadFile<any>[]) => {
    if (files && files.length > 0) {
      setFile(files[0].originFileObj as File);
      setImageUploaded(true);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      if (file) {
        const predictionResult = await predict(file);
        setResult(predictionResult);

        // Gửi dữ liệu đến API MongoDB
        const data = {
          image: file as Blob,
          disease: predictionResult.disease,
          confidence: predictionResult.confidence,
          time: new Date().toISOString(),
          username: 'username', // Thay đổi 'username' này thành tên người dùng thực tế
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
    setImageUploaded(false);
  };
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div>
        <h1>Skin Cancer Detection</h1>
        <Upload
          accept=".png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={(info) => handleFileChange(info.fileList)}
        >
          <Button>Select Image</Button>
        </Upload>

        {imageUploaded ? (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : ''}
              alt={file?.name || ''}
              width={200}
            />
          </div>
        ) : (
          <div
            style={{
              border: '1px dashed #ccc',
              padding: '10px',
              width: '200px',
              height: '200px',
            }}
          >
            <p>Select an Image</p>
          </div>
        )}
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={handlePredict} loading={loading}>
            Predict
          </Button>
          <Button type="primary" onClick={handleClear} loading={loading}>
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
