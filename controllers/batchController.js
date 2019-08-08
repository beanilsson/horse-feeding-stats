const express = require('express');
const router = express.Router();
const async = require('async');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');

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
                    if (batch.name === consumption.batch) {
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

router.post('/', (req, res) => {
    const batch = new Batch({name: req.body.batchName, weight: req.body.batchWeight});
    batch.save().then((err) => {
        res.render('pages/batchSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
