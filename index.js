const express = require('express');
const app = express();
const dbUrl = 'mongodb://localhost:27017/hfs';
const mongoose = require('mongoose');
const async = require('async');
const bodyParser = require('body-parser');

const batches = require('./controllers/batchController');
const consumptions = require('./controllers/consumptionController');
const animalGroups = require('./controllers/animalGroupController');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.use('/batches', batches);
app.use('/consumptions', consumptions);
app.use('/animalGroups', animalGroups);


mongoose.connect(dbUrl, {useNewUrlParser: true});

app.listen(3000);
console.log('Server listening on port 3000');
