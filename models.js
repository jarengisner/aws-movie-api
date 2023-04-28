//requires mongoose, importing it's functionality into this file//
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'actors' }],
  ImageUrl: String,
  Featured: Boolean,
});

let actorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birthday: Date,
});

//lays out the schema for our users//
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }],
});
//creates methods for hashing password//
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
//creates method on user object for validating the password//
userSchema.methods.validatePassword = function (password) {
  //Here is where our password input is hashed when logging in and compared to the stored hashed password//
  console.log(this.password);
  return bcrypt.compare(password, this.password);
};
/*Could this work:
userSchema.methods.validatePassword = async function(password){
  try{
    await bcrypt.compare(password, this.Password)
  }catch(error){
    console.log(error);
  }
}*/

//pairs our collection name with our collection schema, telling our collection to follow this schema//
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//resume here after building database//
let Actor = mongoose.model('Actor', actorSchema);
//exports our movie schema and our user schema, so that we can import them in other documents//
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Actor = Actor;
