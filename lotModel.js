const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
    name: String,
    weight: Number
});

module.exports = mongoose.model('Lot', lotSchema);
