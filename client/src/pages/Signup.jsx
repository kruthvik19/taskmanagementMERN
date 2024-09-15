import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()

    let err = false

    // Client-side validation
    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (username.length < 8) {
      err = true
      setUsernameErrText('Username must be at least 8 characters')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }
    if (password.length < 8) {
      err = true
      setPasswordErrText('Password must be at least 8 characters')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Please fill this field')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Confirm password does not match')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username, password, confirmPassword
      })
      setLoading(false)
      localStorage.setItem('token', res.token)
      window.alert('User created successfully!') // Alert box
      navigate('/')
    } catch (err) {
      setLoading(false)
      if (err.data && err.data.errors) {
        const errors = err.data.errors
        errors.forEach(e => {
          if (e.param === 'username') {
            setUsernameErrText(e.msg)
          }
          if (e.param === 'password') {
            setPasswordErrText(e.msg)
          }
          if (e.param === 'confirmPassword') {
            setConfirmPasswordErrText(e.msg)
          }
        })
      } else {
        // Handle other types of errors, e.g., network errors
        console.error(err)
      }
    }

    // Alert for validation errors
    if (username.length < 8 || password.length < 8) {
      window.alert('Username and password must each be at least 8 characters long.')
    }
  }

  return (
    <>
      <Box
        component='form'
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Signup
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/login'
        sx={{ textTransform: 'none' }}
      >
        Already have an account? Login
      </Button>
    </>
  )
}

export default Signup
