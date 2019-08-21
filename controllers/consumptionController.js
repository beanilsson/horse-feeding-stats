const express = require('express');
const router = express.Router();
const async = require('async');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');
const AnimalGroup = require('../models/animalGroupModel');

const storeCheckboxValues = (values) => {
    let array = [];

    if (typeof values === 'string') {
        array.push(values);
        return array;
    } else {
        values.forEach((value) => {
            array.push(value);
        });

        return array;
    }
};

router.get('/', (req, res) => {
    async.parallel({
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            }).sort({_id: -1}).limit(10);
        },
        batches: (callback)=> {
            Batch.find((err, batches) => {
                callback(err, batches);
            });
        },
        animalGroups: (callback) => {
            AnimalGroup.find((err, animalGroups) => {
                callback(err, animalGroups);
            });
        }}, (err, result) => {
            if (err) {
                console.log(err);
                res.render('pages/error');
            } else {
                res.render('pages/consumption', {
                    batches: result.batches,
                    consumptions: result.consumptions,
                    animalGroups: result.animalGroups
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

    if (req.body.consumptionAnimalGroup === undefined) {
        res.render('pages/consumptionAnimalGroupError');
    } else {
        const animalGroups = storeCheckboxValues(req.body.consumptionAnimalGroup);
        animalGroups.forEach((animalGroup) => {
            while(currentDate <= lastDate) {
                dates.push(currentDate);
                tempDate = new Date(currentDate);
                tempDate.setDate(tempDate.getDate() + 1);
                currentDate = tempDate;
            };

            dates.forEach((date) => {
                const consumption = new Consumption({date: date, amount: req.body.consumptionAmount, batch: req.body.consumptionBatch, animalGroup: animalGroup});
                consumption.save().then((err) => {
                }, (err) => {
                    console.log(err);
                    res.render('pages/error');
                    return;
                });
            });
        });
        res.render('pages/consumptionSaved');
    }
});

module.exports = router;
