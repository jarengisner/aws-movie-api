const jwtSecret = 'Super Secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport.js');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: User.username,
    expiresIn: '7d',
    algorith: 'HS256',
  });
};

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        res.status(400).json({
          message: 'Something went wrong',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
