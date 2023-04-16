const BusinessProfileModel = require('../models/businessProfile.model');
const ERROR = require('../utils/Error');

exports.createBusinessProfile = async (req, res, next) => {
    try {
        const businessProfile = new BusinessProfileModel(req.body);
        await businessProfile.save();
        res.status(201).json(businessProfile);
    } catch (err) {
        next(err)
    }
};
exports.getAllBusinessProfile = async (req, res, next) => {
    try {
        const businessProfile = await BusinessProfileModel.find();
        res.status(201).json(businessProfile)
    } catch (err) {
        next(err)
    }
}
exports.getBusinessProfileById = async (req, res, next) => {
    try {
        const businessProfile = await BusinessProfileModel.findById(req.params.id).populate('reviews', 'title desc likeCount dislikeCount');
        if (!businessProfile) {
            return next(ERROR(404, 'Business profile not found'));
        }
        res.status(200).json(businessProfile);
    } catch (err) {
        next(err)
    }
};

exports.updateBusinessProfileById = async (req, res, next) => {
    try {
        const businessProfile = await BusinessProfileModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!businessProfile) {
            return next(ERROR(404, 'Business profile not found'));
        }
        res.status(200).json(businessProfile);
    } catch (err) {
        next(err)
    }
};

exports.deleteBusinessProfileById = async (req, res, next) => {
    try {
        const businessProfile = await BusinessProfileModel.findByIdAndDelete(req.params.id);
        if (!businessProfile) {
            return next(ERROR(404, 'Business profile not found'));
        }
        res.status(200).json({ message: 'Business profile deleted successfully' });
    } catch (err) {
        next(err)
    }
};
