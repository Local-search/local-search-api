const mongoose = require("mongoose");

const businessProfileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
        },
        email: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        province: {
            name: { type: String },
            city: { type: String },
            ward: { type: Number },
            tolOrMarga: { type: String },
        },

        location: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
        },
        catg: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        keyWord: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Keyword",
            },
        ],
        postBox: {
            type: String
        },
        establishIn: {
            type: Number,
            required: 'please choose the year when the business was establish'
        },
        site: {
            type: String,
        },
        nosite: {
            type: Boolean
        },
        socailMedia: {
            insta: { type: String },
            fb: { type: String },
            twitter: { type: String },
        },
        openAllTime: {
            type: Boolean,
        },
        time: {
            from: {
                type: String,
                enum: [
                    "12:00 AM",
                    "12:30 AM",
                    "01:00 AM",
                    "01:30 AM",
                    "02:00 AM",
                    "02:30 AM",
                    "03:00 AM",
                    "03:30 AM",
                    "04:00 AM",
                    "04:30 AM",
                    "05:00 AM",
                    "05:30 AM",
                    "06:00 AM",
                    "06:30 AM",
                    "07:00 AM",
                    "07:30 AM",
                    "08:00 AM",
                    "08:30 AM",
                    "09:00 AM",
                    "09:30 AM",
                    "10:00 AM",
                    "10:30 AM",
                    "11:00 AM",
                    "11:30 AM",
                    "12:00 PM",
                    "12:30 PM",
                    "01:00 PM",
                    "01:30 PM",
                    "02:00 PM",
                    "02:30 PM",
                    "03:00 PM",
                    "03:30 PM",
                    "04:00 PM",
                    "04:30 PM",
                    "05:00 PM",
                    "05:30 PM",
                    "06:00 PM",
                    "06:30 PM",
                    "07:00 PM",
                    "07:30 PM",
                    "08:00 PM",
                    "08:30 PM",
                    "09:00 PM",
                    "09:30 PM",
                    "10:00 PM",
                    "10:30 PM",
                    "11:00 PM",
                    "11:30 PM",
                ],
            },
            to: {
                type: String,
                enum: [
                    "12:00 AM",
                    "12:30 AM",
                    "01:00 AM",
                    "01:30 AM",
                    "02:00 AM",
                    "02:30 AM",
                    "03:00 AM",
                    "03:30 AM",
                    "04:00 AM",
                    "04:30 AM",
                    "05:00 AM",
                    "05:30 AM",
                    "06:00 AM",
                    "06:30 AM",
                    "07:00 AM",
                    "07:30 AM",
                    "08:00 AM",
                    "08:30 AM",
                    "09:00 AM",
                    "09:30 AM",
                    "10:00 AM",
                    "10:30 AM",
                    "11:00 AM",
                    "11:30 AM",
                    "12:00 PM",
                    "12:30 PM",
                    "01:00 PM",
                    "01:30 PM",
                    "02:00 PM",
                    "02:30 PM",
                    "03:00 PM",
                    "03:30 PM",
                    "04:00 PM",
                    "04:30 PM",
                    "05:00 PM",
                    "05:30 PM",
                    "06:00 PM",
                    "06:30 PM",
                    "07:00 PM",
                    "07:30 PM",
                    "08:00 PM",
                    "08:30 PM",
                    "09:00 PM",
                    "09:30 PM",
                    "10:00 PM",
                    "10:30 PM",
                    "11:00 PM",
                    "11:30 PM",
                ],
            },
        },
        days: [
            {
                type: Number,
                max: 7,
            },
        ],
        formFillerInfo: {
            fName: {
                type: String,
                required: true,
            },
            lName: {
                type: String,
                required: true,
            },
            phone: {
                type: Number,
            },
            email: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            message: {
                type: String
            }
        },
        TermsAndConditions: {
            type: String,
            enum: ["agree", "disagree"],
            require: "You should confirm that you agree to our Terms and Conditions."
        },

        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reviews',
            default: [],
        }],
        rating: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        }
        ,
        status: {
            type: String,
            enum: ["true", "false"],
            default: "false",
        },
        businessInfoUpdatedAt: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

const BusinessProfileModel = mongoose.model(
    "BusinessProfile",
    businessProfileSchema
);

module.exports = BusinessProfileModel;
