const mongoose = require('mongoose');

const animalGroupSchema = new mongoose.Schema({
    name: String,
    amount: Number
});

module.exports = mongoose.model('AnimalGroup', animalGroupSchema);
