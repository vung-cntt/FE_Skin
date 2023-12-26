import bcrypt from 'bcryptjs';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';
export const auth = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('refreshToken', data.refresh_token);
    return data;
  } catch (error) {
    // Handle errors here
    console.error('An error occurred during login:', error);
  }
};

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  // Mã hóa mật khẩu
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      username,
      email,
      password: hashedPassword,
    });

    if (response.status === 200) {
      console.log('Successfully registered!');
      return response.data;
    }
  } catch (error) {
    console.error('An error occurred during signup:', error);
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    // Lấy refresh_token từ localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_BASE_URL}/token/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // Lưu access_token mới vào localStorage nếu bạn muốn
    localStorage.setItem('accessToken', response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    throw new Error('Unable to refresh token');
  }
};
