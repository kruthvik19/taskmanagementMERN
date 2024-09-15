const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jsonwebtoken = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register user
exports.register = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

    // Check if a user with the same email already exists
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Create new user
    const user = await User.create({
      username,
      password: encryptedPassword,
      email: email || '' // Allow email to be optional
    });

    // Generate token
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select('password username email');
    if (!user) {
      return res.status(401).json({
        errors: [{ param: 'username', msg: 'Invalid username or password' }]
      });
    }

    // Decrypt password
    const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [{ param: 'username', msg: 'Invalid username or password' }]
      });
    }

    user.password = undefined; // Don't return the password

    // Generate token
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload; // sub is Google's unique user id

    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create new user with Google credentials
      user = await User.create({
        username: email, // Use email or any logic for username
        email,
        password: CryptoJS.AES.encrypt(sub, process.env.PASSWORD_SECRET_KEY).toString(), // Encrypt the Google ID (sub) as password
        name
      });
    } else {
      // If user exists, optionally update user info if needed
      user.name = name;
      await user.save();
    }

    // Generate token
    const jwtToken = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({ user, token: jwtToken });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};
