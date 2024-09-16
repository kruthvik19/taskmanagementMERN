import axios from 'axios';
import queryString from 'query-string';

// Use environment variable or fallback to Render URL
const baseUrl = 'https://taskmanagementmern-wsle.onrender.com/api/v1/';
const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
}, error => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(response => {
  return response.data || response;
}, error => {
  if (!error.response) {
    console.error('Network error:', error);
    return Promise.reject('Network error');
  }
  return Promise.reject(error.response);
});

export default axiosClient;
