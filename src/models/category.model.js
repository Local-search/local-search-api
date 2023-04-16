const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['false', 'true'],
        default: 'false',
    },
});

const CategoryModel = mongoose.model('Categorys', categorySchema);
module.exports = CategoryModel