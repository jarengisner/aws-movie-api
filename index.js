const express = require('express');
const app = express();
const morgan = require('morgan');

//list of my top 10 movies//
let myFavoriteMovies = [
  {
    Rank: 1,
    title: 'Interstellar',
  },
  {
    rank: 2,
    title: 'Shawshank Redemption',
  },
  {
    rank: 3,
    title: 'Everything Everywhere All at Once',
  },
  {
    rank: 4,
    title: 'Spirited Away',
  },
  {
    rank: 5,
    title: 'Get Out',
  },
  {
    rank: 6,
    title: 'Midsommar',
  },
  {
    rank: 7,
    title: 'Joker',
  },
  {
    rank: 8,
    title: 'Life Aquatica',
  },
  {
    rank: 9,
    title: 'Us',
  },
  {
    rank: 10,
    title: 'Parasite',
  },
];

app.use(express.static('public'));
app.use(morgan('common'));

//GET Requests//
app.get('/movies', (req, res) => {
  res.json(myFavoriteMovies);
});
//Accepts a title as a request parameter, to filter movies//
//Accepts a string//
app.get('/movies/:title', (req, res) => {
  res.json(
    myFavoriteMovies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});
//Accepts the name of an actor as a request parameter//
//Accepts a string//
app.get('/movies/:actors', (req, res) => {
  res.json(
    myFavoriteMovies.find((movie) => {
      return movie.actors === req.params.actors;
    })
  );
});
//Accepts the name of a director as a request parameter//
//Accepts a string//
app.get('/movies/:directors', (req, res) => {
  res.json(
    myFavoriteMovies.find((movie) => {
      return movie.directors === req.params.directors;
    })
  );
});
//Accepts a genre as a request parameter//
//Accepts a string//
app.get('/movies/:genre', (req, res) => {
  res.json(
    myFavoriteMovies.find((movie) => {
      return movie.genre === req.params.genre;
    })
  );
});

app.get('/users/favorites/', (req, res) => {
  res.send(
    'In the future this will send a list of the current users favorites list'
  );
});

app.get('/directors', (req, res) => {
  res.json(leadDirectors);
});

app.get('/actors', (req, res) => {
  res.json(leadActors);
});

app.get('/directors/:name', (req, res) => {
  res.json(
    leadDirectors.find((director) => {
      return director.name === req.params.name;
    })
  );
});

app.get('/actors/:name', (req, res) => {
  res.json(
    leadActors.find((actor) => {
      return actor.name === req.params.name;
    })
  );
});

//POST Requests//
app.post('users/register', (req, res) => {
  res.send(
    'Will take in an email from a form in the future, and return that username post-validation, along with status code'
  );
});

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
