const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({

    komik_id : Number,
    genre_name : String,
    create_at : Date,

});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;