const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    refillable: Boolean
});

module.exports = mongoose.model('Batch', batchSchema);
