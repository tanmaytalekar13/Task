/**
 * User model schema definition.
 * This schema defines the structure of the User document in the MongoDB database.
 * It includes fields for username, password, addresses, and recent searches.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [{
    house: { type: String, required: true },
    apartment: { type: String, required: true },
    category: { type: String, required: true },
    fullAddress: { type: String, required: true }
  }],
  recentSearches: [{ type: String }] // Store recent search addresses
});

module.exports = mongoose.model('User', userSchema);
