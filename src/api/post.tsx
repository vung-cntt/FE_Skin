import axios from 'axios';
import { PostsResponse } from '../interfaces/models/getPost';
const API_BASE_URL = 'http://127.0.0.1:5000/api';
// Set up the token for your axios requests

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const createPost = async (
  title: string,
  //   content: string,
  image: File | null
) => {
  const formData = new FormData();
  formData.append('title', title);
  //   formData.append('content', content);
  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, formData);
    return response.data;
  } catch (error) {
    console.error('Error creating post', error);
    throw error;
  }
};

export const addComment = async (post_id: number, text: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${post_id}/comments`,
      {
        text,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment', error);
    throw error;
  }
};

export const addReaction = async (post_id: number, type: 'like' | 'unlike') => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${post_id}/reactions`,
      {
        type,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding reaction', error);
    throw error;
  }
};

export const addReply = async (
  post_id: number,
  comment_id: number,
  text: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${post_id}/comments/${comment_id}/replies`,
      { text }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding reply', error);
    throw error;
  }
};

export const getAllPosts = async (): Promise<PostsResponse> => {
  try {
    const response = await axios.get<PostsResponse>(
      `${API_BASE_URL}/getAllposts`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error);
    throw error;
  }
};
