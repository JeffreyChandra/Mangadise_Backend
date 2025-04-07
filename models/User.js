const mongoose = require('mongoose');
const Favorite = require('./Favorite');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    point : { type: Number, default: 0 },
    // favorites: [{ type: Schema.Types.ObjectId, ref: 'Komik' }],
    created_at: { type: Date, default: Date.now }

});

const User = mongoose.model('User', userSchema);

module.exports = User;