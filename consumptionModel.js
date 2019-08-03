const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
    date: Date,
    amount: Number,
    unit: String,
    fodderType: String,
    lot: String
});

module.exports = mongoose.model('Consumption', consumptionSchema);
