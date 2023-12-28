import axios from 'axios';
const API_BASE_URL = 'http://127.0.0.1:5000/api';
import { PredictionPage } from '../interfaces/models/getpredict';
const accessToken = localStorage.getItem('accessToken');

export const getPredictionsByUserId = async (
  page: number,
  page_size: number
): Promise<PredictionPage> => {
  try {
    const response = await axios.get<PredictionPage>(
      `${API_BASE_URL}/get_predictions_by_user_id`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
export const deletePrediction = async (predictionId: number): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/delete_prediction/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || error.message };
    } else {
      return { error: (error as Error).message || 'An unknown error occurred' };
    }
  }
};

export const filterDisease = async (
  disease: string,
  page: number,
  page_size: number
): Promise<any> => {
  try {
    const response = await axios.get<PredictionPage>(
      `${API_BASE_URL}/search/predictions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          disease,
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
