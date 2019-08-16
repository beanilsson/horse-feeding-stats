const express = require('express');
const router = express.Router();
const async = require('async');
const uniqueError = require('../utils/uniqueError');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');
const AnimalGroup = require('../models/animalGroupModel');

router.get('/', (req, res) => {
    async.parallel({
        batches: (callback) => {
            Batch.find((err, batches) => {
                callback(err, batches);
            });
        },
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            });
        },
        animalGroups: (callback) => {
            AnimalGroup.find((err, animalGroups) => {
                callback(err, animalGroups);
            });
        }
    }, (err, results) => {
        if (err) {
            console.log(err);
            res.render('pages/error');
        } else {
            let left = null;
            let batchWeight = null;
            let animalGroup = null;

            async.each(results.batches, (batch, callback) => {
                batchWeight = batch.weight;

                results.consumptions.forEach((consumption) => {
                    if (batch.name === consumption.batch) {

                        animalGroup = results.animalGroups.find((ag) => {
                            return ag.name === consumption.animalGroup;
                        });

                        left = batchWeight -= (consumption.amount *= animalGroup.amount);

                    }
                });

                if (left === null){
                    batch.left = batch.weight;
                    callback();
                } else {
                    batch.left = left;
                    left = null;
                    callback();
                }
            }, (err) => {
                res.render('pages/batch', {
                    batches: results.batches,
                    errorMessage: null
                });
            });
        }
    });
});

router.post('/', (req, res) => {
    const batchRefillable = req.body.batchRefillable === 'Ja' ? true : false;
    const batch = new Batch({name: req.body.batchName, weight: req.body.batchWeight, refillable: batchRefillable});
    batch.save().then((err) => {
        res.render('pages/batchSaved');
    }, (err) => {
        let errorMessage = '';
        if (uniqueError.check(err) === true) {
            errorMessage = uniqueError.createMessage('batch', err);
        } else {
            errorMessage = 'Ett oväntat fel uppstod';
        }

        Batch.find((err, batches) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.render('pages/batch', {
                    batches: batches,
                    errorMessage: errorMessage
                });
            }
        });
    });
});

router.post('/:batchName/:batchWeight', (req, res) => {
    const batchName = req.params.batchName;
    const previousWeight = parseFloat(req.params.batchWeight);
    const refillAmount = parseFloat(req.body.batchRefillAmount);
    const newAmount = previousWeight + refillAmount;

    Batch.updateOne({name: batchName}, {weight: newAmount}, {upsert: true}, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.render('pages/batchRefilled');
        }
    });

});

module.exports = router;
