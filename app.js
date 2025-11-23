require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const generateToken = require('./middlewares/generateToken');

const index = require('./routes/index');
const users = require('./routes/users');
const authorRouter = require('./routes/authorRouter');
const bookRouter = require('./routes/bookRouter');
const dvdRouter = require('./routes/dvdRouter');
const cdRouter = require('./routes/cdRouter');

// MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/media_api';
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'Erro de conexão:'));
mongoose.connection.once('open', () => console.log('Conexão com MongoDB estabelecida.'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessão + Passport
app.use(session({ secret: 'segredo_media_api', resave: false, saveUninitialized: false }));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Rotas de autenticação Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Gerar JWT após login com Google
    const token = generateToken(req.user);
    // Devolver token em JSON para uso no Postman
    res.json({ token });
  }
);

// Rotas REST
app.use('/', index);
app.use('/users', users);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/dvds', dvdRouter);
app.use('/cds', cdRouter);

// 404
app.use(function(req, res, next) {
  const err = new Error('Não encontrado');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // Sempre responder JSON em rotas da API
  if (req.path.startsWith('/authors') || req.path.startsWith('/books') || req.path.startsWith('/dvds') || req.path.startsWith('/cds')) {
    return res.json({ error: err.message });
  }
  res.render('error', { message: err.message, error: req.app.get('env') === 'development' ? err : {} });
});

module.exports = app;
