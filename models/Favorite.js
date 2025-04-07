const mongoose = require('mongoose');
const { create } = require('./Chapter');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({

    komik_id : String,
    user_id : String,
    create_at : {type : Date, default: Date.now},

});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;