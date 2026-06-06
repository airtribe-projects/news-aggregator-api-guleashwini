require('dotenv').config();
const express = require('express');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/news', newsRouter);

// Start background cache refresh only outside of tests
if (process.env.NODE_ENV !== 'test') {
    require('./services/cacheUpdater');
}

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;