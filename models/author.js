const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);
