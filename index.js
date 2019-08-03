const express = require('express');
const app = express();
const dbUrl = 'mongodb://localhost:27017/hfs';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Lot = require('./lotModel');
const Consumption = require('./consumptionModel');

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
            res.render('pages/error');
        } else {
            res.render('pages/batch', {
                batches: data
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

app.get('/consumption', (req, res) => {
    Consumption.find((err, consumptions) => {
        if (err) {
            console.log(err);
            res.render('pages/error');
        } else {
            Lot.find((err, batches) => {
                if (err) {
                    console.log(err);
                    res.render('pages/error');
                } else {
                    res.render('pages/consumption', {
                        batches: batches,
                        consumptions: consumptions
                    });
                }
            });
        }
    });
});

app.post('/consumption', (req, res) => {
    const consumption = new Consumption({date: req.body.consumptionDate, amount: req.body.consumptionAmount, unit: req.body.consumptionUnit, fodderType: req.body.consumptionFodderType, lot: req.body.consumptionBatch});
    consumption.save().then((err) => {
        res.render('pages/consumptionSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

mongoose.connect(dbUrl, {useNewUrlParser: true});

app.listen(3000);
console.log('Server listening on port 3000');
