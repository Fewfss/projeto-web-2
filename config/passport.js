const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(u => done(null, u)).catch(done));

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  }, async (token, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 'google.id': profile.id });
      if (user) return done(null, user);
      user = await User.create({
        google: {
          id: profile.id,
          token,
          name: profile.displayName,
          email: (profile.emails && profile.emails[0] && profile.emails[0].value) || ''
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
