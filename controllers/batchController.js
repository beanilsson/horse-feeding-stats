const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');

const uniqueError = require('../utils/uniqueError');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');
const AnimalGroup = require('../models/animalGroupModel');

const fodderTypes = ['Hö', 'Mineralfoder', 'Halm', 'Lusern'];

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
            let currentAmount = null;

            async.each(results.batches, (batch, callback) => {
                batch.scheduledAmount = scheduledAmount(batch, results.consumptions, results.animalGroups);
                batch.consumedAmount = consumedAmount(batch, results.consumptions, results.animalGroups);
                callback();
            }, (err) => {
                const units = ['kg', 'dl'];

                res.render('pages/batch', {
                    fodderTypes: fodderTypes,
                    batches: results.batches,
                    units: units,
                    errorMessage: null
                });
            });
        }
    });
});

router.post('/', (req, res) => {
    const batchRefillable = req.body.batchRefillable === 'Ja' ? true : false;
    const batch = new Batch({name: req.body.batchName, weight: req.body.batchWeight, refillable: batchRefillable, fodderType: req.body.batchFodderType, unit: req.body.batchUnit,});
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

const scheduledAmount = (batch, consumptions, animalGroups) => {
    let animalGroup = {};
    let amount = 0;
    let batchWeight = batch.weight;

    async.each(consumptions, (consumption) => {
        if (batch.name === consumption.batch) {

            animalGroup = animalGroups.find((ag) => {
                return ag.name === consumption.animalGroup;
            });

            amount = batchWeight -= (consumption.amount * animalGroup.amount);
        }
    });

    return amount;
};

const consumedAmount = (batch, consumptions, animalGroups) => {
    let animalGroup = {};
    let amount = 0;
    let batchWeight = batch.weight;
    let today = moment();

    async.each(consumptions, (consumption) => {
        if (moment(consumption.date) < today) {
            if (batch.name === consumption.batch) {

                animalGroup = animalGroups.find((ag) => {
                    return ag.name === consumption.animalGroup;
                });


                amount = batchWeight -= (consumption.amount * animalGroup.amount);
            }
        }
    });

    return amount;
};

module.exports = router;
