const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
    date: Date,
    amount: Number,
    unit: String,
    type: {type: String}
});

module.exports = mongoose.model('Lot', lotSchema);
