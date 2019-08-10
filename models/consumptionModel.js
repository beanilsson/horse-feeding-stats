const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    batch: { type: String, required: true },
    horse: String,
    animalGroup: String,
    fodderType: { type: String, required: true } //move fodderType to batch
});

module.exports = mongoose.model('Consumption', consumptionSchema);
