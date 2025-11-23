const express = require('express');
const router = express.Router();
const CD = require('../models/cd');
const requireAuth = require('../middlewares/requireAuth');

router.route('/')
  .get(async (req, res) => {
    const cds = await CD.find().populate('author');
    res.json(cds);
  })
  .post(requireAuth, async (req, res) => {
    // Atribuir author automaticamente se ausente
    if (!req.body.author && req.userId) req.body.author = req.userId;
    try {
      const cd = await CD.create(req.body);
      res.status(201).json(cd);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const cd = await CD.findById(req.params.id).populate('author');
    if (!cd) return res.status(404).json({ error: 'CD não encontrado' });
    res.json(cd);
  })
  .put(requireAuth, async (req, res) => {
    if (!req.body.author && req.userId) req.body.author = req.userId;
    const cd = await CD.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author');
    if (!cd) return res.status(404).json({ error: 'CD não encontrado' });
    res.json(cd);
  })
  .delete(requireAuth, async (req, res) => {
    const resp = await CD.findByIdAndDelete(req.params.id);
    if (!resp) return res.status(404).json({ error: 'CD não encontrado' });
    res.json(resp);
  });

module.exports = router;
