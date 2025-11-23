const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  google: {
    id: String,
    token: String,
    name: String,
    email: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
