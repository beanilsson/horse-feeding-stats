const path = require('path');
const express = require('express');
const app = express();
const dbUrl = 'mongodb://localhost:27017/hfs';
const mongoose = require('mongoose');
const Lot = require('./lotModel');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/batch', (req, res) => {
    Lot.find((err, data) => {
        if (err) {
            console.log(err);
            res.render('pages/batch', {
                batches: [],
                message: ''
            });
        } else {
            res.render('pages/batch', {
                batches: data,
                message: ''
            });
        }
    });
});

app.post('/batch', (req, res) => {
    const lot = new Lot({name: req.body.batchName, weight: req.body.batchWeight});
    lot.save().then((err) => {
        res.render('pages/batchSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

mongoose.connect(dbUrl, {useNewUrlParser: true});

app.listen(3000);
console.log('Server listening on port 3000');
