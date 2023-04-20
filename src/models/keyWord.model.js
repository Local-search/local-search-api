const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
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
keywordSchema.index({ label: "text" })
keywordSchema.index({ popular: 1 })
const KeywordModel = mongoose.model('Keywords', keywordSchema);
module.exports = KeywordModel