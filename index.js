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

app.get('/movies', (req, res) => {
  res.json(myFavoriteMovies);
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
