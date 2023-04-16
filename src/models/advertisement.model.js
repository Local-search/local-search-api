const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    advertiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    businessProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessProfile",
    },
    endDate: { type: Date, required: true },
    clicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    catg: [
        {
            type: String,
            required: true,
        },
    ],
    adsType: {
        type: String,
        enum: ["display", "search", "related"],
        required: true
    },
    keyWord: [
        {
            type: String,
            required: true,
        },
    ],
    link: { type: String },
    status: {
        type: String,
        enum: ["rejected", "pending", "approved"],
        default: "pending",
    },
}, {
    timestamps: true
});



const AdvertisementModel = mongoose.model("Advertisement", AdvertisementSchema);
module.exports = AdvertisementModel