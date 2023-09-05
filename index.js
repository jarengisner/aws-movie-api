import 'dotenv/config';
//imports express//
const express = require('express');
//imports morgan//
const morgan = require('morgan');
//imports body parser to be able to parse req bodies//
const bodyParser = require('body-parser');
//imports mongoose//
const mongoose = require('mongoose');
//imports our models file//
const Models = require('./models.js');
//imports our validation functinoality from express validator//
const { check, validationResult } = require('express-validator');
//declares our express application//
const app = express();
//body parser middleware//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//imports cors (cross origin requests)//
const cors = require('cors');
app.use(cors());

let auth = require('./auth.js')(app);
//imports passport//
const passport = require('passport');
require('./passport.js');

//declares variables for our models//
const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

//Code that connects to our actual database//

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware for express and also the common morgan package//
app.use(express.static('public'));
app.use(morgan('common'));

//GET Requests//
//Home page, in future will send you to index page//

app.get('/', (req, res) => {
  res.send('Currently a test page');
});

/**
 * GET request to get all movies from the database
 * @async
 * @returns {Promise} Array of all movies within the database
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        res.status(500).send('Error : ' + err);
      });
  }
);
//Accepts a title as a request parameter, to filter movies//
//Accepts a string//

/**
 * GET request to get a movie by Title
 * @async
 * @param {string} Title
 * @returns {Promise} movie object from database
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error : ' + err);
      });
  }
);

//Accepts an actors ObjectId as a parameter//

app.get(
  '/movies/actors/:Actors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Actors: [req.params.Actors] })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        res.status(500).send('Error : ' + err);
      });
  }
);

//Accepts a Directors ObjectID as a parameter//

/**
 * GET request to get a movie by Director
 * @async
 * @param {string} Directors
 * @returns {Promise} movie object from database
 */
app.get(
  '/movies/directors/:Directors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Directors })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        res.status(500).send('Error : ' + err);
      });
  }
);
//Accepts a genre as a request parameter//
//Accepts a string//

/**
 * GET request to get a movie by Genre Name
 * @async
 * @param {string} genreName
 * @returns {Promise} movie object from database
 */
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        res.status(500).send('Error : ' + err);
      });
  }
);

//Actors//
app.get(
  '/actors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Actors.find()
      .then((actor) => {
        res.status(201).json(actor);
      })
      .catch((err) => {
        res.status(500).send(err + 'error');
      });
  }
);
//get all users//

/**
 * GET request to get all users
 * @async
 * @returns {Promise} user data from database
 */
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error :' + error);
      });
  }
);

/**
 * GET request to get a user by their username
 * @async
 * @param {string} username
 * @returns {Promise} the user's data from the database
 */
app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error : ' + err);
      });
  }
);

/**
 * GET request to get a user's favorites by username
 * @async
 * @param {string} username
 * @returns {Promise} the user's favorites data from the database
 */
app.get(
  '/users/:username/favorites',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.json(user.favorites);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err + 'Error');
      });
  }
);

/**
 * POST request to create a user's account
 * @async
 * @param {string} Username from input
 * @param {string} Password from input
 * @param {string} Email from input
 * @param {Date} Birthday from input
 * @returns {Promise} the users account information object
 */
app.post(
  '/users',
  check('Username', 'Username must be 5 characters or longer').isLength({
    min: 5,
  }),
  check(
    'Username',
    'Username contains non-Alphanumeric characters'
  ).isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Valid Email Address is required').isEmail(),
  (req, res) => {
    //validation error handling function//
    let errors = validationResult(req);
    //if errors.isEmpty is not true, meaning if there are errors//
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //hashes our password and assigns it to this variable//
    let hashedPass = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists!');
        } else {
          Users.create({
            Username: req.body.Username,
            //our password is now created with our hashed password instead of our raw string//
            Password: hashedPass,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
              console.log('success');
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send(error + 'error');
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error + 'error');
      });
  }
);

//PUT Requests//

/**
 * PUT request to get a user's favorites by username
 * @async
 * @param {string} username
 * @param {string} movieId
 * @returns {Promise} the updated user information with new favorite
 */
app.put(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      { $push: { Favorites: req.params.movieId } },
      { new: true }
    ).then((user) => {
      res.status(201).json(user);
    });
  }
);

/**
 * GET request to get a user's favorites by username
 * @async
 * @param {string} username
 * @param {string}Username
 * @param {string}Password
 * @param {string}Email
 * @param {Date}Birthday
 * @returns {Promise} the updated user information from the database
 */
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //validation error handling function//
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //variable for updated hashed password//
    let updatedHashedPassword = Users.hashPassword(req.body.Password);
    Users.updateOne(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: updatedHashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      }
    ).then((user) => {
      if (!user) {
        return res.status(500).send(req.params.username + 'not found');
      } else {
        res.json(user);
      }
    });
  }
);

//DELETE//

/**
 * DELETE request to remove a movie from the users favorites
 * @async
 * @param {string} username
 * @param {string} movieId
 * @returns {Promise} the new user object with the movie removed from their favorites
 */
app.delete(
  '/users/:username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $pull: {
          Favorites: req.params.movieId,
        },
      },
      { new: true }
    ).then((user) => {
      res.status(201).json(user);
    });
  }
);

/**
 * DELETE request to delete an account by username
 * @async
 * @param {string} username
 * @returns {Promise} confirmation string that the user was deleted
 */
app.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
      .then((user) => {
        if (!user) {
          res.send(req.params.username + 'was not found');
        } else {
          res.send(req.params.username + 'was deleted.');
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err + 'error');
      });
  }
);
//middleware that listens for any problems in booting up the server, and handles the error//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

//added new listen function to pull a port from the ENV variable, and if one is not found, to default to 8080?//
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
