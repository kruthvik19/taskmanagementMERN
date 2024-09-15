import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import authApi from '../api/authApi';  // Ensure this has a method for Google login

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');
  const [generalErrText, setGeneralErrText] = useState(''); // For general errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');
    setGeneralErrText(''); // Reset general error

    const data = new FormData(e.target);
    const username = data.get('username').trim();
    const password = data.get('password').trim();

    let err = false;

    // Frontend validation for empty fields and length
    if (username === '') {
      err = true;
      setUsernameErrText('Please fill this field');
    }
    if (username.length < 8) {
      err = true;
      setUsernameErrText('Username must be at least 8 characters');
    }
    if (password === '') {
      err = true;
      setPasswordErrText('Please fill this field');
    }
    if (password.length < 8) {
      err = true;
      setPasswordErrText('Password must be at least 8 characters');
    }

    // If errors exist, return early
    if (err) return;

    setLoading(true);

    try {
      // Attempt to login via authApi
      const res = await authApi.login({ username, password });

      // Handle successful response
      setLoading(false);
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      // Log the entire error response for better debugging
      console.error('Login Error:', err);

      // Handle error messages returned by the API
      const errors = err?.data?.errors || [{ param: 'server', msg: 'Something went wrong. Please try again.' }];

      // Specific error handling
      errors.forEach((e) => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg);
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg);
        }
        if (e.param === 'server') {
          setGeneralErrText(e.msg);  // General server errors
        }
      });

      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const { credential } = response;
    console.log('Google login successful:', credential);

    try {
      // Send the Google token to your backend for validation
      const res = await authApi.googleLogin({ token: credential });

      // Handle successful response
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
      setGeneralErrText('Google login failed. Please try again.');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    setGeneralErrText('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="330861374506-s4kf2olkhajgp59r153t8mrcg69jcj8v.apps.googleusercontent.com"> {/* Replace with your client ID */}
      <Box
        component="form"
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Login
        </LoadingButton>
        <Typography color="error" sx={{ mt: 2 }}>
          {usernameErrText || passwordErrText || generalErrText}
        </Typography>

        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </Box>
      <Button
        component={Link}
        to="/signup"
        sx={{ textTransform: 'none', mt: 2 }}
      >
        Don't have an account? Signup
      </Button>
    </GoogleOAuthProvider>
  );
};

export default Login;
