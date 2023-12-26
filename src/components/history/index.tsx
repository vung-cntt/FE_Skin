// PredictionsView.tsx
import React, { useState, useEffect } from 'react';
import { getPredictionsByUserId } from '../../api/history';
import { PredictionPage, Prediction } from '../../interfaces/models/getpredict';
import { BreadcrumbProps } from 'antd';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  TablePaginationConfig,
} from 'antd';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.history,
      title: <Link to={webRoutes.history}>History</Link>,
    },
  ],
};
const History = () => {
  // Cập nhật state để sử dụng kiểu Prediction[]
  const [predictionPage, setPredictionPage] = useState<PredictionPage>({
    data: [], // Mảng của Prediction
    total_records: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const page = 1;
    const page_size = 10;
    getPredictionsByUserId(page, page_size)
      .then((data) => {
        setPredictionPage(data); // Cập nhật để set dữ liệu là PredictionPage
        setLoading(false);
      })
      .catch((error) => {
        console.error('An error occurred while fetching predictions:', error);
        setError('An error occurred while fetching predictions.');
        setLoading(false);
      });
  }, []);
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setLoading(true);

    // Set default values for current page and page size in case they are undefined
    const currentPage = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;

    getPredictionsByUserId(currentPage, pageSize)
      .then((data) => {
        setPredictionPage(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('An error occurred while fetching predictions:', error);
        setError('Failed to fetch predictions.');
        setLoading(false);
      });
  };
  const handleDelete = (id: number) => {
    // Thêm kiểu dữ liệu cho id
    // Logic để xóa prediction dựa trên id
    console.log('Deleting prediction with id:', id);
    message.success('Prediction deleted successfully');
  };

  const handleView = (id: number) => {
    // Thêm kiểu dữ liệu cho id
    // Logic để xem chi tiết prediction dựa trên id
    console.log('Viewing prediction with id:', id);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Disease',
      dataIndex: 'disease',
      key: 'disease',
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Prediction) => (
        <Space size="middle">
          <Button onClick={() => handleView(record.id)}>View</Button>
          <Popconfirm
            title="Are you sure to delete this prediction?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  if (loading) return <div>Loading predictions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Table
        columns={columns}
        dataSource={predictionPage.data}
        rowKey="id"
        loading={loading}
        pagination={{
          total: predictionPage.total_records,
          current: predictionPage.current_page,
          pageSize: predictionPage.page_size,
          showSizeChanger: true, // cho phép thay đổi số lượng mục trên mỗi trang
        }}
        onChange={handleTableChange} // Thêm prop này để xử lý sự kiện thay đổi trang
      />
    </BasePageContainer>
  );
};

export default History;
