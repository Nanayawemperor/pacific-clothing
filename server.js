const express = require('express');
const bodyParser = require('body-parser')
const app = express();


const mongodb = require('./data/database');
const port = process.env.PORT || 3030;

app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and running on port ${port}`)});
    }
})