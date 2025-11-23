const express = require('express');
const router = express.Router();
const DVD = require('../models/dvd');
const requireAuth = require('../middlewares/requireAuth');

router.route('/')
  .get(async (req, res) => {
    const dvds = await DVD.find().populate('author');
    res.json(dvds);
  })
  .post(requireAuth, async (req, res) => {
    // Se o corpo não incluir `author`, e o middleware `requireAuth`
    // definiu `req.userId`, atribuímos automaticamente o autor.
    if (!req.body.author && req.userId) req.body.author = req.userId;
    try {
      const dvd = await DVD.create(req.body);
      res.status(201).json(dvd);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const dvd = await DVD.findById(req.params.id).populate('author');
    if (!dvd) return res.status(404).json({ error: 'DVD não encontrado' });
    res.json(dvd);
  })
  .put(requireAuth, async (req, res) => {
    // Se o corpo não incluir `author`, usar `req.userId` se disponível
    if (!req.body.author && req.userId) req.body.author = req.userId;
    const dvd = await DVD.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author');
    if (!dvd) return res.status(404).json({ error: 'DVD não encontrado' });
    res.json(dvd);
  })
  .delete(requireAuth, async (req, res) => {
    const resp = await DVD.findByIdAndDelete(req.params.id);
    if (!resp) return res.status(404).json({ error: 'DVD não encontrado' });
    res.json(resp);
  });

module.exports = router;
