const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({

    komik_id : String,
    chapter_num : Number,
    link : String,
    price : Number,
    published_at : Date,
    create_at : {type : Date, default: Date.now},
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;