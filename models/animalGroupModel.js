const mongoose = require('mongoose');

const animalGroupSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    deleted: {type: Boolean, default: false},
    deleteDate: Date //use this to exclude consumptions for animalGroups after this date
});

module.exports = mongoose.model('AnimalGroup', animalGroupSchema);
