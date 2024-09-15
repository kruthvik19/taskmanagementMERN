import axios from 'axios';
import queryString from 'query-string';

const baseUrl = 'http://127.0.0.1:5000/api/v1/';
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
