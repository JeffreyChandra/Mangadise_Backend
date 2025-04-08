require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');
const KomikRouter = require('./api/Komik');
const ChapterRouter = require('./api/Chapter');
const FavoriteRouter = require('./api/Favorite');
const GenreRouter = require('./api/Genre');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/user', UserRouter)
app.use('/komik', KomikRouter)
app.use('/chapter', ChapterRouter)
app.use("/favorite", FavoriteRouter)
app.use("/genre", GenreRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});