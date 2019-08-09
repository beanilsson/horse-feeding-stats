const express = require('express');
const router = express.Router();

const Horse = require('../models/horseModel');

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
    const horse = new Horse({name: req.body.horseName, weight: req.body.horseWeight, birthYear: req.body.horseBirthYear});
    horse.save().then((err) => {
        res.render('pages/horseSaved');
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
