const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const requireToken = require('../middlewares/requireToken'); // agora usando JWT

// Listar todos os autores
router.route('/')
  .get(async (req, res) => {
    const authors = await Author.find();
    res.json(authors);
  })
  .post(requireToken, async (req, res) => {
    try {
      const author = await Author.create(req.body);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Operações em um autor específico
router.route('/:id')
  .get(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Autor não encontrado' });
    res.json(author);
  })
  .put(requireToken, async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ error: 'Autor não encontrado' });
    res.json(author);
  })
  .delete(requireToken, async (req, res) => {
    const resp = await Author.findByIdAndDelete(req.params.id);
    if (!resp) return res.status(404).json({ error: 'Autor não encontrado' });
    res.json(resp);
  });

module.exports = router;
