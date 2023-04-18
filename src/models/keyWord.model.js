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
});
keywordSchema.index({ label: "text" })
const KeywordModel = mongoose.model('Keywords', keywordSchema);
module.exports = KeywordModel