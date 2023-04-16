const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    businessProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessProfile',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        max: 50,
    },
    desc: {
        type: String,
        max: 200,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
     likeCount: {
        type: Number,
        default: 0,
    },
    dislikeCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const ReviewModel = mongoose.model('reviews', reviewSchema)
module.exports = ReviewModel