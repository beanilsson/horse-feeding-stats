const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
    date: Date,
    amount: Number,
    unit: String,
    fodderType: String,
    batch: String,
    horse: String,
    animalGroup: String
});

module.exports = mongoose.model('Consumption', consumptionSchema);
