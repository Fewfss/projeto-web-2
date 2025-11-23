const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_jwt';

function generateToken(user, opts = {}) {
  const payload = {
    id: user.id || user._id || (user && user._doc && user._doc._id),
    email: user.email || user.mail || undefined,
  };
  const options = Object.assign({ expiresIn: '2h' }, opts);
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = generateToken;
