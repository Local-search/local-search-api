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
            return next(ERROR(404, "there is no data with accosicate id to update!"));
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
        ).select("status")
        console.log(updateStatus)
        if (!updateStatus) {
            return next(ERROR(404, "there is no data with accosicate id to update!"));
        }
        res.status(201).json(updateStatus);
    } catch (err) {
        next(err)
    }
}
module.exports = { businessStatus }