const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    birthYear: Number
});

module.exports = mongoose.model('Horse', horseSchema);
