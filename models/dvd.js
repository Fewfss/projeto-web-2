const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dvdSchema = new Schema({
  title: { type: String, required: true, unique: true },
  genre: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // minutos
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true }
}, { timestamps: true });

module.exports = mongoose.model('DVD', dvdSchema);
