const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: String,
    weight: Number
});

module.exports = mongoose.model('Batch', batchSchema);
