const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    point : { type: Number, default: 0 }, // Default point = 0 saat user baru dibuat
    created_at : { type: Date, default: Date.now }

});

const User = mongoose.model('User', userSchema);

module.exports = User;