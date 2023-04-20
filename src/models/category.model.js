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
        index: true
    },
    popular: {
        type: Number,
        default: 5
    }
});
categorySchema.index({ label: "text" })
categorySchema.index({ popular: 1 })

const CategoryModel = mongoose.model('Categorys', categorySchema);
module.exports = CategoryModel