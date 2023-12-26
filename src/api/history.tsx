import axios from 'axios';
const API_BASE_URL = 'http://127.0.0.1:5000/api';
import { PredictionPage } from '../interfaces/models/getpredict';

export const getPredictionsByUserId = async (
  page: number,
  page_size: number
): Promise<PredictionPage> => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get<PredictionPage>(
      `${API_BASE_URL}/get_predictions_by_user_id`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};
