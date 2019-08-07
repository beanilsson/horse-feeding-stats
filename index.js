const express = require('express');
const app = express();
const dbUrl = 'mongodb://localhost:27017/hfs';
const mongoose = require('mongoose');
const async = require('async');
const bodyParser = require('body-parser');
const Lot = require('./lotModel');
const Consumption = require('./consumptionModel');
const Horse = require('./horseModel');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/batch', (req, res) => {
    async.parallel({
        batches: (callback) => {
            Lot.find((err, batches) => {
                callback(err, batches);
            });
        },
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            });
        }
    }, (err, results) => {
        if (err) {
            console.log(err);
            res.render('pages/error');
        } else {

            results.batches.forEach((batch) => {
                let left = null;
                let batchWeight = batch.weight;
                results.consumptions.forEach((consumption) => {
                    if (batch.name === consumption.lot) {
                        left = batchWeight -= consumption.amount;
                    }
                });
                if (left === null){
                    batch.left = batch.weight;
                } else {
                    batch.left = left;
                }
            });

            res.render('pages/batch', {
                batches: results.batches
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
    async.parallel({
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            });
        },
        batches: (callback)=> {
            Lot.find((err, consumptions) => {
                callback(err, consumptions);
            });
        },
        horses: (callback) => {
            Horse.find((err, horses) => {
                callback(err, horses);
            });
        }}, (err, result) => {
            if (err) {
                console.log(err);
                res.render('pages/error');
            } else {
                const units = ['kg', 'dl'];
                const fodderTypes = ['Hö', 'Mineralfoder', 'Halm'];

                res.render('pages/consumption', {
                    batches: result.batches,
                    consumptions: result.consumptions,
                    units: units,
                    fodderTypes: fodderTypes,
                    horses: result.horses
                });
            }
        });
});

app.post('/consumption', (req, res) => {
    const consumption = new Consumption({date: req.body.consumptionDate, amount: req.body.consumptionAmount, unit: req.body.consumptionUnit, fodderType: req.body.consumptionFodderType, lot: req.body.consumptionBatch, horse: req.body.consumptionHorse});
    consumption.save().then((err) => {
        res.render('pages/consumptionSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('/horse', (req, res) => {
    Horse.find((err, horses) => {
        if (err) {
            console.log(err);
            res.render('pages/error');
        } else {
            res.render('pages/horse', {
                horses: horses
            });
        }
    });
});

app.post('/horse', (req, res) => {
    const horse = new Horse({name: req.body.horseName, weight: req.body.horseWeight, birthYear: req.body.horseBirthYear});
    horse.save().then((err) => {
        res.render('pages/horseSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

mongoose.connect(dbUrl, {useNewUrlParser: true});

app.listen(3000);
console.log('Server listening on port 3000');
