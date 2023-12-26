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
export const deletePrediction = async (predictionId: number): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(
      `${API_BASE_URL}/delete_prediction/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Sử dụng Bearer token cho việc xác thực
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Kiểm tra để xem error có phải là một instance của AxiosError không
    if (axios.isAxiosError(error)) {
      // Nếu là AxiosError, ta có thể sử dụng error.response
      return { error: error.response?.data || error.message };
    } else {
      // Nếu không phải AxiosError, chỉ sử dụng error.message hoặc một string cố định
      return { error: (error as Error).message || 'An unknown error occurred' };
    }
  }
};
