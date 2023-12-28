import axios from 'axios';
import { PredictionDetail } from '../interfaces/models/getdetailpredict';
const API_BASE_URL = 'http://127.0.0.1:5000/api';
const token = localStorage.getItem('accessToken'); // Lấy access_token từ localStorage

export const predict = async (formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const store = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/store`, data);
  return response.data;
};

export const getUserInfo = async () => {
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await axios.get(`${API_BASE_URL}/get_user_info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getDetailPreidct = async (
  id: string
): Promise<PredictionDetail> => {
  try {
    const response = await axios.get<PredictionDetail>(
      `${API_BASE_URL}/get_prediction/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};
