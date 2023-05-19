const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    image: { type: String, required: true },
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    businessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
    },
    budget: {
      type: Number,
      required: "enter your advertisement Budget",
    },
    endDate: { type: Date, required: true, index: true },
    clicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false, index: true },
    catg: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorys",
      },
    ],
    keyWord: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KeyWords",
      },
    ],
    important: {
      type: Boolean,
      default: false,
      index: true,
    },
    adsType: {
      type: String,
      enum: ["DISPLAY", "SEARCH", "TEXT"],
      required: true,
    },
    link: { type: String },
    status: {
      type: String,
      enum: ["REJECTED", "PENDING", "APPROVED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);
AdvertisementSchema.index({ title: "text" });
AdvertisementSchema.index({ desc: "text" });
AdvertisementSchema.index({ budget: -1 }, { background: true });
AdvertisementSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });
AdvertisementSchema.index({ status: 1 }, { background: true });
AdvertisementSchema.index({ adsType: 1 }, { background: true });
AdvertisementSchema.index({ businessProfile: 1 }, { background: true });
AdvertisementSchema.index({ catg: 1 }, { background: true });
AdvertisementSchema.index({ keyword: 1 }, { background: true });
AdvertisementSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "APPROVED" } },
  { background: true }
);
AdvertisementSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "PENDING" } },
  { background: true }
);
AdvertisementSchema.index(
  { adsType: 1 },
  { partialFilterExpression: { adsType: "DISPLAY" } },
  { background: true }
);
AdvertisementSchema.index(
  { adsType: 1 },
  { partialFilterExpression: { adsType: "SEARCH" } },
  { background: true }
);
AdvertisementSchema.index(
  { adsType: 1 },
  { partialFilterExpression: { adsType: "TEXT" } },
  { background: true }
);

const AdvertisementModel = mongoose.model("Advertisement", AdvertisementSchema);
module.exports = AdvertisementModel;
