const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Movies = Models.Movie;
const Users = Models.User;

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

app.get('/movies', (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});
//Accepts a title as a request parameter, to filter movies//
//Accepts a string//
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error : ' + err);
    });
});

//Accepts an actors ObjectId as a parameter//
app.get('/movies/:Actors', (req, res) => {
  Movies.findOne({ Actors: req.params.Actors })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});

//Accepts a Directors ObjectID as a parameter//
app.get('/movies/:Directors', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Directors })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});
//Accepts a genre as a request parameter//
//Accepts a string//
app.get('/movies/:GenreName', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.GenreName })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});

app.get('/users', (req, res) => {
  Users.find()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error :' + error);
    });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({ username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error : ' + err);
    });
});

app.get('/users/:username/favorites', (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user.favorites);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err + 'Error');
    });
});

//Need to create databases for Directors and Actors, to then make these URL endpoints work//

/*app.get('/directors', (req, res) => {
  res.json(leadDirectors);
});

app.get('/actors', (req, res) => {
  res.json(leadActors);
});*/

//accepts string for name//
/*app.get('/directors/:name', (req, res) => {
  res.send('In the future will respond with all details about an director');
});

//accepts string for name//
app.get('/actors/:name', (req, res) => {
  res.send('Will in the future respond with all details about an actor');
});*/

//POST Requests//
app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists!');
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birthday: req.body.birthday,
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

app.put('/users/:username/movies/:movieId', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $push: { favorites: req.params.movieId } },
    { new: true }
  ).then((user) => {
    res.status(201).json(user);
  });
});

//PUT Requests//
//accepts string for users username//
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
      },
    }
  ).then((user) => {
    if (!user) {
      return res.status(500).send(req.params.username + 'not found');
    } else {
      res.json(user);
    }
  });
});

//DELETE//
//accepts string as title of the movie//
app.delete('/users/favorites/:title', (req, res) => {
  res.send('When favorites are available, will be able to delte movie by name');
});

//accepts string as username of the user//
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove(
    { username: req.params.username }
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
      })
  );
});
//middleware that listens for any problems in booting up the server, and handles the error//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('The app is running on 8080');
});
