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
    },
});

const KeywordModel = mongoose.model('Keywords', keywordSchema);
module.exports = KeywordModel