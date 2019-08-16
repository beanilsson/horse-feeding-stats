const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    batch: { type: String, required: true },
    animalGroup: String
});

module.exports = mongoose.model('Consumption', consumptionSchema);
