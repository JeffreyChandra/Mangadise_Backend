const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({

    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    create_at : Date,

});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;