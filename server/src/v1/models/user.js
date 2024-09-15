const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    sparse: true // Allow emails to be unique but not required
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: '' // Default to an empty string if not provided
  },
  // Other fields as necessary
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
