require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');
const KomikRouter = require('./api/Komik');
const ChapterRouter = require('./api/Chapter');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/user', UserRouter)
app.use('/komik', KomikRouter)
app.use('/chapter', ChapterRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});