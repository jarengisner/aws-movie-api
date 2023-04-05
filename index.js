const express = require('express');
const app = express();
const morgan = require('morgan');

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
app.get('/movies/:actor', (req, res) => {
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

app.get('/users/:username/favorites', (req, res) => {
  res.send(
    'In the future this will send a list of the current users favorites list'
  );
});

app.get('/users/:username/favorites/:title', (req, res) => {
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

//accepts string for name//
app.get('/directors/:name', (req, res) => {
  res.send('In the future will respond with all details about an director');
});

//accepts string for name//
app.get('/actors/:name', (req, res) => {
  res.send('Will in the future respond with all details about an actor');
});

//POST Requests//
app.post('/users/register', (req, res) => {
  res.status(200).send('Working!');
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
