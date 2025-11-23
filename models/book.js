const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Adiciona tipo Currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  author: { type: String, required: true }
}, { timestamps: true });

const bookSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  label: { type: String, default: '' },
  price: { type: Currency },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Livro', bookSchema);
