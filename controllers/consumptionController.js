const express = require('express');
const router = express.Router();
const async = require('async');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');
const Horse = require('../models/horseModel');

router.get('/', (req, res) => {
    async.parallel({
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            });
        },
        batches: (callback)=> {
            Batch.find((err, consumptions) => {
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

router.post('/', (req, res) => {
    const consumption = new Consumption({date: req.body.consumptionDate, amount: req.body.consumptionAmount, unit: req.body.consumptionUnit, fodderType: req.body.consumptionFodderType, batch: req.body.consumptionBatch, horse: req.body.consumptionHorse});
    consumption.save().then((err) => {
        res.render('pages/consumptionSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
