const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const batchSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true},
    weight: {type: Number},
    unknownAmount: {type: Boolean, required: true},
    refillable: {type: Boolean, required: true},
    unit: { type: String, required: true },
    fodderType: { type: String, required: true}
});

batchSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Batch', batchSchema);
