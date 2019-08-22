const express = require('express');
const router = express.Router();
const async = require('async');

const AnimalGroup = require('../models/animalGroupModel');
const Consumption = require('../models/consumptionModel');

router.get('/', (req, res) => {
    AnimalGroup.find((err, animalGroups) => {
        if (err) {
            console.log(err);
            res.render('pages/error');
        } else {
            res.render('pages/animalGroup', {
                animalGroups: animalGroups
            });
        }
    });
});

router.post('/', (req, res) => {
    const animalGroup = new AnimalGroup({name: req.body.animalGroupName, amount: req.body.animalGroupAmount});
    animalGroup.save().then((err) => {
        res.render('pages/animalGroupSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.post('/delete/:animalGroupName', (req, res) => {
    const animalGroupName = req.params.animalGroupName;

    async.parallel([
        (callback) => {
            AnimalGroup.deleteOne({name: animalGroupName}, (err) => {
                callback();
            });
        },
        (callback) => {
            Consumption.deleteMany({animalGroup: animalGroupName}, (err) => {
                callback();
            });
        }
    ], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.render('pages/animalGroupDeleted');
        }
    });

});

module.exports = router;
