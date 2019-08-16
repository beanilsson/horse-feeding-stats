const express = require('express');
const router = express.Router();
const async = require('async');

const Batch = require('../models/batchModel');
const Consumption = require('../models/consumptionModel');
const AnimalGroup = require('../models/animalGroupModel');

const storeCheckboxValues = (values) => {
    let array = [];
    if(typeof values != []) {
        array.push(values);
    } else {
        array = values;
    }

    return array;
};

router.get('/', (req, res) => {
    async.parallel({
        consumptions: (callback) => {
            Consumption.find((err, consumptions) => {
                callback(err, consumptions);
            }).sort({_id: 1}).limit(10);
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
                const units = ['kg', 'dl'];
                const fodderTypes = ['Hö', 'Mineralfoder', 'Halm'];

                res.render('pages/consumption', {
                    batches: result.batches,
                    consumptions: result.consumptions,
                    units: units,
                    fodderTypes: fodderTypes,
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

    const animalGroups = storeCheckboxValues(req.body.consumptionAnimalGroup);

    animalGroups.forEach((animalGroup) => {
        while(currentDate <= lastDate) {
            dates.push(currentDate);
            tempDate = new Date(currentDate);
            tempDate.setDate(tempDate.getDate() + 1);
            currentDate = tempDate;
        };

        dates.forEach((date) => {
            const consumption = new Consumption({date: date, amount: req.body.consumptionAmount, unit: req.body.consumptionUnit, fodderType: req.body.consumptionFodderType, batch: req.body.consumptionBatch, animalGroup: animalGroup});
            consumption.save().then((err) => {
                res.render('pages/consumptionSaved');
            }, (err) => {
                console.log(err);
                res.render('pages/error');
            });
        });
    });

});

module.exports = router;
