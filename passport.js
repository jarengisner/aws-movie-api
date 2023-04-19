const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, callback) => {
      console.log(username + '' + password);
      Users.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password',
          });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'this JWT secret',
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
