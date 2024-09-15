import axiosClient from "./axiosClient";

const authApi = {
  signup: params => axiosClient.post('auth/signup', params),
  login: params => axiosClient.post('auth/login', params),
  verifyToken: () => axiosClient.post('auth/verify-token', {}, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }),
  
  // Google login method
  googleLogin: params => axiosClient.post('auth/google-login', params)  // Assuming you have an API endpoint for Google login
};

export default authApi;
