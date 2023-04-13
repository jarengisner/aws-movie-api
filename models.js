//requires mongoose, importing it's functionality into this file//
const mongoose = require('mongoose');

//sets schema for our movie data//
//sets our key value pairs with some controls for what data type they accept//
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImageUrl: String,
  Featured: Boolean,
});
//lays out the schema for our users//
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }],
});

//pairs our collection name with our collection schema, telling our collection to follow this schema//
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//exports our movie schema and our user schema, so that we can import them in other documents//
module.exports.Movie = Movie;
module.exports.User = User;