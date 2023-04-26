const myKey = require('./key.js');
const mySecretKey = myKey.secretKey;
const jwtSecret = mySecretKey;

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');
//declares function we will return to pass token to the user//
//user is a parameter passed from the login function below//
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate(
      'local',
      { session: false },
      /*callback*/ (error, user, info) => {
        //The above is our callback referred to from passport.js, determines what happens when our passport checks fail when authenticating with our local strategy//
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
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
      }
    )(req, res);
  });
};
