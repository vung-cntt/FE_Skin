import { BreadcrumbProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';

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
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    setFileList(info.fileList);
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Upload
        action="/api/upload" // Replace with your actual upload API endpoint
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
    </BasePageContainer>
  );
};

export default Predict;
