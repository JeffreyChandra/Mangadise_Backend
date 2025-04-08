const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  komik_id: {
    type: Schema.Types.ObjectId,
    ref: 'Komik',
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
