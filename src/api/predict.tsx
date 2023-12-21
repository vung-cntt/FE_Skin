import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';
export const predict = async (file: string | Blob) => {
  const formData = new FormData();
  formData.append('file', file);

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
