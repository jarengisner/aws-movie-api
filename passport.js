//requires passport for authentication//
const passport = require('passport'),
  //imports local strategy authentication//
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

//uses the passport middleware we imported to create a new strategy from the local strategy library//
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    //Used async await because I feel like it simplified writing this//
    async (username, password, callback) => {
      console.log(username + ' ' + password);
      try {
        const user = await Users.findOne({ Username: username });
        //checks is the user exists in the db//
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, { message: 'Incorrect Username' });
        }
        //uses our validate password method which checks hashed password against db storage//
        //Our password we input is already hashed and compared when we send our login request, due to calling authenticate//
        if (user.validatePassword(password) !== user.Password) {
          console.log('incorrect password');
          return callback(null, false, { message: 'Incorrect password' });
        }
        //if none of the above are the case, this runs//
        console.log('It worked');
        return callback(null, user);
      } catch (error) {
        console.log(error);
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Super Secret',
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
