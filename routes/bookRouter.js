const express = require('express');
const router = express.Router();
const Books = require('../models/book');
const requireAuth = require('../middlewares/requireAuth');

router.route('/')
  .get(async (req, res) => {
    const books = await Books.find().populate('author');
    res.json(books);
  })
  .post(requireAuth, async (req, res) => {
    // Atribuir author automaticamente se ausente
    if (!req.body.author && req.userId) req.body.author = req.userId;
    try {
      const book = await Books.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const book = await Books.findById(req.params.id).populate('author');
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    res.json(book);
  })
  .put(requireAuth, async (req, res) => {
    if (!req.body.author && req.userId) req.body.author = req.userId;
    const book = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author');
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    res.json(book);
  })
  .delete(requireAuth, async (req, res) => {
    const resp = await Books.findByIdAndDelete(req.params.id);
    if (!resp) return res.status(404).json({ error: 'Livro não encontrado' });
    res.json(resp);
  });

// Comments
router.route('/:id/comments')
  .get(async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    res.json(book.comments);
  })
  .post(requireAuth, async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    // Preencher autor do comentário com email do usuário ou userId
    if (!req.body.author && req.user) req.body.author = req.user.email || req.userId;
    book.comments.push(req.body);
    await book.save();
    res.status(201).json(book);
  })
  .delete(requireAuth, async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    book.comments = [];
    await book.save();
    res.json({ message: 'Excluir todos os comentários!' });
  });

router.route('/:id/comments/:commentId')
  .get(async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const comment = book.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json(comment);
  })
  .put(requireAuth, async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const old = book.comments.id(req.params.commentId);
    if (!old) return res.status(404).json({ error: 'Comentário não encontrado' });
    old.remove();
    if (!req.body.author && req.user) req.body.author = req.user.email || req.userId;
    book.comments.push(req.body);
    await book.save();
    res.json(book);
  })
  .delete(requireAuth, async (req, res) => {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const c = book.comments.id(req.params.commentId);
    if (!c) return res.status(404).json({ error: 'Comentário não encontrado' });
    c.remove();
    await book.save();
    res.json(book);
  });

module.exports = router;
