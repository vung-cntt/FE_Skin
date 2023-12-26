import axios from 'axios';
const API_BASE_URL = 'http://127.0.0.1:5000/api';
import { Prediction } from '../interfaces/models/getpredict';

export const getPredictionsByUserId = async (): Promise<Prediction[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${API_BASE_URL}/get_predictions_by_user_id`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};
