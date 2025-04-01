require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/user', UserRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});