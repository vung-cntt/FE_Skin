// PredictionsView.tsx
import React, { useState, useEffect } from 'react';
import { getPredictionsByUserId, deletePrediction } from '../../api/history';
import { PredictionPage, Prediction } from '../../interfaces/models/getpredict';
import { BreadcrumbProps } from 'antd';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  // Cập nhật state để sử dụng kiểu Prediction[]
  const [pagesData, setPagesData] = useState<Record<number, Prediction[]>>({});
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
    fetchPageData(1, predictionPage.page_size);
  }, []);
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
  const fetchPageData = (page: number, pageSize: number) => {
    setLoading(true);

    // Nếu dữ liệu cho trang hiện tại đã có sẵn, sử dụng dữ liệu đó và tránh gọi API
    if (pagesData[page]) {
      setPredictionPage((prev) => ({
        ...prev,
        data: pagesData[page],
        current_page: page,
        page_size: pageSize,
      }));
      setLoading(false);
    } else {
      // Nếu không, tải dữ liệu mới từ API
      getPredictionsByUserId(page, pageSize)
        .then((data) => {
          setPagesData((prevPagesData) => ({
            ...prevPagesData,
            [page]: data.data,
          }));
          setPredictionPage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('An error occurred while fetching predictions:', error);
          setError('An error occurred while fetching predictions.');
          setLoading(false);
        });
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // Set default values for current page and page size in case they are undefined
    const currentPage = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;

    // Kiểm tra xem dữ liệu cho trang hiện tại đã có sẵn trong pagesData chưa
    if (pagesData[currentPage]) {
      setPredictionPage((prev) => ({
        ...prev,
        data: pagesData[currentPage],
        current_page: currentPage,
        page_size: pageSize,
      }));
    } else {
      // Nếu không, gọi API để tải dữ liệu
      getPredictionsByUserId(currentPage, pageSize)
        .then((data) => {
          setPagesData((prevPagesData) => ({
            ...prevPagesData,
            [currentPage]: data.data,
          }));
          setPredictionPage(data);
        })
        .catch((error) => {
          console.error('An error occurred while fetching predictions:', error);
          setError('Failed to fetch predictions.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deletePrediction(id);
    if (!result.error) {
      message.success('Prediction deleted successfully');
      // Cập nhật lại pagesData và predictionPage để loại bỏ item đã xóa
      setPagesData((prevPagesData) => {
        const updatedPagesData = { ...prevPagesData };
        Object.keys(updatedPagesData).forEach((pageKey) => {
          const page = Number(pageKey);
          updatedPagesData[page] = updatedPagesData[page].filter(
            (prediction: { id: number }) => prediction.id !== id
          );
        });
        return updatedPagesData;
      });
      setPredictionPage((prev) => ({
        ...prev,
        data: prev.data.filter((prediction) => prediction.id !== id),
        total_records: prev.total_records - 1,
      }));
    } else {
      console.error('Error deleting prediction:', result.error);
      message.error('Failed to delete prediction: ' + result.error);
    }
  };

  const handleView = (id: number) => {
    // Thêm kiểu dữ liệu cho id
    navigate(`/getDetail/${id}`);
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
