const express = require('express');
const router = express.Router();

const AnimalGroup = require('../models/animalGroupModel');

router.get('/', (req, res) => {
    AnimalGroup.find({deleted: false}, (err, animalGroups) => {
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

router.post('/:animalGroupName', (req, res) => {
    const animalGroupName = req.params.animalGroupName;

    AnimalGroup.updateOne({name: animalGroupName}, {deleted: true}, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.render('pages/animalGroupDeleted');
        }
    });
});

module.exports = router;
