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

//list of my top 10 movies//
let myFavoriteMovies = [
  {
    Rank: 1,
    title: 'Interstellar',
    directors: 'Christopher Nolan',
    actors: 'Matthew McConaughey',
    genre: 'sci-fi',
  },
  {
    rank: 2,
    title: 'Shawshank Redemption',
    directors: 'Frank Darabont',
    actors: 'Tim Robbins',
    genre: 'drama',
  },
  {
    rank: 3,
    title: 'Everything Everywhere All at Once',
    directors: 'Daniel Kwan',
    actors: 'Michelle Yeoh',
    genre: 'drama',
  },
  {
    rank: 4,
    title: 'Spirited Away',
    directors: 'Hayao Miyazaki',
    actors: 'Rumi Hiiragi',
    genre: 'action',
  },
  {
    rank: 5,
    title: 'Get Out',
    directors: 'Jordan Peele',
    actors: 'Daniel Kaluuya',
    genre: 'horror',
  },
  {
    rank: 6,
    title: 'Midsommar',
    directors: 'Ari Aster',
    actors: 'Florence Pugh',
    genre: 'horror',
  },
  {
    rank: 7,
    title: 'Joker',
    directors: 'Todd Phillips',
    actors: 'Joaquin Pheonix',
    genre: 'drama',
  },
  {
    rank: 8,
    title: 'Life Aquatica',
    directors: 'Wes Anderson',
    actors: 'Bill Murray',
    genre: 'comedy',
  },
  {
    rank: 9,
    title: 'Us',
    directors: 'Jordan Peele',
    actors: "Lupita Nyong'o",
    genre: 'horror',
  },
  {
    rank: 10,
    title: 'Parasite',
    directors: 'Bong Joon-Ho',
    actors: 'Choi Woo-Shik',
    genre: 'horror',
  },
];

let leadActors = [];
let leadDirectors = [];

(function createLists() {
  myFavoriteMovies.forEach((movie) => {
    leadActors.push(movie.actors);
    leadDirectors.push(movie.directors);
  });
})();

app.use(express.static('public'));
app.use(morgan('common'));

//GET Requests//
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
//Accepts the name of an actor as a request parameter//
//Accepts a string//
app.get('/movies/:Actors', (req, res) => {
  Movies.findOne({ Actors: req.params.Actors })
    .then((actor) => {
      res.status(201).json(actor);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});
//Accepts the name of a director as a request parameter//
//Accepts a string//
app.get('/movies/:Directors', (req, res) => {
  Movies.findOne({ Directors: req.params.Directors })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      res.status(500).send('Error : ' + err);
    });
});
//Accepts a genre as a request parameter//
//Accepts a string//
app.get('/movies/:Genre', (req, res) => {
  Movies.findOne({ Genre: req.params.Genre })
    .then((genre) => {
      res.status(201).json(genre);
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
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error : ' + err);
    });
});

/*app.get('/users/:username/favorites', (req, res) => {
  res.send(
    'In the future this will send a list of the current users favorites list'
  );
});*/

/*app.get('/users/:username/favorites/:title', (req, res) => {
  res.send(
    'In the future this will send a list of the current users favorites list'
  );
});*/

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
          Username: req.body.Username,
          Password: req.body.Password,
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

app.post('/users/favorites', (req, res) => {
  res.status(200).send('Working!');
});

//PUT Requests//
//accepts string for users username//
app.put('/users/:username', (req, res) => {
  res.send(
    'In future, application will accept new username through this request parameter'
  );
});

//DELETE//
//accepts string as title of the movie//
app.delete('/users/favorites/:title', (req, res) => {
  res.send('When favorites are available, will be able to delte movie by name');
});

//accepts string as username of the user//
app.delete('/users/:username', (req, res) => {
  res.send(
    'When users have availability to register, function will search to see if user is registered, and then delete the user.'
  );
});
//Home page, in future will send you to index page//
app.get('/', (req, res) => {
  res.send('Welcome to my favorite movies!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Thee app is running on 8080');
});
