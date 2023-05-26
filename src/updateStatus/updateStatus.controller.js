const categoryModel = require("../models/category.model");
const keywordModel = require("../models/keyWord.model");
const businessProfileModel = require("../models/businessProfile.model");
const AdvertisementModel = require("../models/advertisement.model");
const ERROR = require("../utils/Error")
const User = require("../models/user.model")
const updateModelStatus = async (Model, id, updateField, res, next) => {
    try {
        const updatedStatus = await Model.findByIdAndUpdate(
            id,
            { $set: { status: updateField } },
            { new: true }
        ).select("status").lean();

        if (!updatedStatus) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }

        res.status(201).json(updatedStatus);
    } catch (err) {
        next(err);
    }
};

const businessStatus = async (req, res, next) => {
    const { status } = req.query;
    const { id } = req.params;

    await updateModelStatus(businessProfileModel, id, status, res, next);
};
const ImportantAds = async (req, res, next) => {
    const { important } = req.query
    const { id } = req.params
    try {
        const importantUpdate = await AdvertisementModel.findByIdAndUpdate(id, { $set: { important } }, { new: true }).select("important").lean()
        if (!importantUpdate) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }
        res.status(201).json(importantUpdate)
    } catch (err) {
        next(err)
    }
}
const updateAdsStatus = async (req, res, next) => {
    const { status } = req.query;
    const { id } = req.params;

    if (status === "REJECTED" || status === "PENDING" || status === "APPROVED") {
        await updateModelStatus(AdvertisementModel, id, status, res, next);
    } else {
        return next(ERROR(404, "Invalid status! Status can be either REJECTED, PENDING, or APPROVED."));
    }
};
const UpdateIsActive = async (req, res, next) => {
    const { isActive } = req.query
    const { id } = req.params

    try {
        const updateisActive = await AdvertisementModel.findByIdAndUpdate(id,
            {
                $set: { isActive }
            },
            { new: true }
        ).select("isActive").lean()
        if (!updateisActive) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }
        res.status(201).json(updateisActive);
    } catch (err) {
        next(err)
    }
}
const updateCatgStatus = async (req, res, next) => {
    const { status } = req.query;
    const { id } = req.params;

    await updateModelStatus(categoryModel, id, status, res, next);
};

const updateKeywordStatus = async (req, res, next) => {
    const { status } = req.query;
    const { id } = req.params;

    await updateModelStatus(keywordModel, id, status, res, next);
};
const updateUserStatus = async (req, res, next)=>{
    const { status } = req.query;
    const { id } = req.params;
    await updateModelStatus(User, id, status, req, next)
}
module.exports = { updateUserStatus, updateKeywordStatus, updateCatgStatus, businessStatus, updateAdsStatus, UpdateIsActive, ImportantAds }