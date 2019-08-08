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
    const firstDate = new Date(req.body.consumptionDateFirst);
    const lastDate = new Date(req.body.consumptionDateLast);
    let currentDate = firstDate;
    let tempDate = null;
    let dates = [];
    const horses = req.body.consumptionHorse;

    horses.forEach((horse) => {
        while(currentDate <= lastDate) {
            dates.push(currentDate);
            tempDate = new Date(currentDate);
            tempDate.setDate(tempDate.getDate() + 1);
            currentDate = tempDate;
        };

        dates.forEach((date) => {
            const consumption = new Consumption({date: date, amount: req.body.consumptionAmount, unit: req.body.consumptionUnit, fodderType: req.body.consumptionFodderType, batch: req.body.consumptionBatch, horse: horse});
            consumption.save().then(() => {
            }, (err) => {
                console.log(err);
                res.render('pages/error');
            });
        });
    });
    res.render('pages/consumptionSaved');
});

module.exports = router;
