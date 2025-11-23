// middlewares/requireAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_jwt';

// Middleware que aceita autenticação por sessão Passport (req.isAuthenticated())
// ou por JWT no header Authorization / x-access-token.
module.exports = function (req, res, next) {
  // Passport session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Tenta token JWT
  const header = req.headers.authorization || req.headers['x-access-token'];
  let token;
  if (header && typeof header === 'string') {
    if (header.startsWith('Bearer ')) token = header.slice(7).trim();
    else token = header.trim();
  }

  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id || decoded._id;
    req.user = decoded;
    next();
  });
};
