const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const komikSchema = new Schema({

    title : String,
    author : String,
    cover : String,
    synopsis : String,
    rate : Number,
    create_at : {type : Date, default: Date.now},
});

const Komik = mongoose.model('Komik', komikSchema);

module.exports = Komik;