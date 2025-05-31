require('./config/db');

const app = require('express')();
const port = process.env.PORT || 8080;

const UserRouter = require('./api/User');
const KomikRouter = require('./api/Komik');
const ChapterRouter = require('./api/Chapter');
const FavoriteRouter = require('./api/Favorite');
const GenreRouter = require('./api/Genre');
const CommentRouter = require('./api/Comment');
const PurchaseChapter = require('./api/PurchaseChapter');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/user', UserRouter)
app.use('/komik', KomikRouter)
app.use('/chapter', ChapterRouter)
app.use("/favorite", FavoriteRouter)
app.use("/genre", GenreRouter)
app.use("/comment", CommentRouter)
app.use("/purchasechapter", PurchaseChapter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});