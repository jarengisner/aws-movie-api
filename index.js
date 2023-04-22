const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

//If we want to restrict CORS to onlly certain domains, use this code, otherwise all is default//
//have to change our above cors method to the below to restrict//
/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));*/

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

mongoose.connect('mongodb://localhost:27017/movie-findr-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware for express and also the common morgan package//
app.use(express.static('public'));
app.use(morgan('common'));

//GET Requests//
//Home page, in future will send you to index page//
app.get('/', (req, res) => {
  res.send('this will lead to documentation');
});

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

//POST Requests//
app.post('/users', (req, res) => {
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
});

//PUT Requests//
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

//accepts string for users username//
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.updateOne(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
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
//accepts string as title of the movie//
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

//accepts string as username of the user//
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

app.listen(8080, () => {
  console.log('The app is running on 8080');
});
