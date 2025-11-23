const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cdSchema = new Schema({
  title: { type: String, required: true, unique: true },
  artist: { type: String, default: '' },
  tracks: { type: Number, default: 0 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true }
}, { timestamps: true });

module.exports = mongoose.model('CD', cdSchema);
