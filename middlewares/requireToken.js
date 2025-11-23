const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_jwt';

// Middleware que exige um JWT válido. Extrai o token do header
// `Authorization: Bearer <token>` ou do header `x-access-token`.
module.exports = function (req, res, next) {
  const header = req.headers.authorization || req.headers['x-access-token'];
  let token;
  if (header && typeof header === 'string') {
    if (header.startsWith('Bearer ')) token = header.slice(7).trim();
    else token = header.trim();
  }

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id || decoded._id;
    req.user = decoded; // payload disponível para handlers
    next();
  });
};
