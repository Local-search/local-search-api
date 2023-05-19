const categoryModel = require("../models/category.model");
const keywordModel = require("../models/keyWord.model");
const businessProfileModel = require("../models/businessProfile.model");
const AdvertisementModel = require("../models/advertisement.model");
const ERROR = require("../utils/Error")
const UpdateStatus = async (req, res, next, model, update, query,) => {
    const { id } = req.params

    try {
        const updateStatus = await model.findByIdAndUpdate(id,
            {
                $set: { query }
            },
            { new: true }
        ).select(`${update}`)
        if (!updateStatus) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }
        res.status(201).json(updateStatus);
    } catch (err) {
        next(err)
    }
}
const businessStatus = async (req, res, next) => {
    const { status } = req.query
    // const query = { status: status }
    // if (!status || status === undefined) {
    //     next(ERROR(400, "status can only be true or false!!!"))
    // } else {
    //     UpdateStatus(req, res, next, businessProfileModel, update = "status", query)
    // }
    // console.log("status", status)
    const { id } = req.params

    try {
        const updateStatus = await businessProfileModel.findByIdAndUpdate(id,
            {
                $set: { status }
            },
            { new: true }
        ).select("status").lean()
        // console.log(updateStatus)
        if (!updateStatus) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }
        res.status(201).json(updateStatus);
    } catch (err) {
        next(err)
    }
}
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
const UpdateAdsStatus = async (req, res, next) => {
    const { status } = req.query
    const { id } = req.params
    if (status !== "REJECTED" || status !== "PENDING" || status !== "APPROVED") {
        return next(ERROR(404, "invalid status!! status can be either REJECTED, PENDING or APPROVED!"));
    }
    try {
        const updatedStatus = await AdvertisementModel.findByIdAndUpdate(id, { $set: { status } }, { new: true }).select("status").lean()
        if (!updatedStatus) {
            return next(ERROR(404, "There is no data with an associated ID to update!"));
        }
        res.status(201).json(updatedStatus);
    } catch (err) {
        next(err)

    }
}
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
module.exports = { businessStatus, UpdateAdsStatus, UpdateIsActive, ImportantAds }