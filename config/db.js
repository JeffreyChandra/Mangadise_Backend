require('dotenv').config();
const monggose = require('mongoose');

monggose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

module.exports = monggose;
;