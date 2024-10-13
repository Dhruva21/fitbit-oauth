// models/Token.js
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
