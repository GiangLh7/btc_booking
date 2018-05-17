const mongoose = require('mongoose');

/**
 * Create user schema
 */
const userSchema = new mongoose.Schema({
    userName: { type: String },
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, lowercase: true },
    languages: [String]
});

/**
 * Create user model
 */
const User = mongoose.model('User', userSchema);

module.exports = User;