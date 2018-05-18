const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Create user schema
 */
const userSchema = new mongoose.Schema({
    userName: { type: String },
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, lowercase: true },
    languages: [String],
    password: { type: String, select: false }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
/**
 * Create user model
 */
const User = mongoose.model('User', userSchema);

module.exports = User;