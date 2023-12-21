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
