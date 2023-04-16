const mongoose = require('mongoose');
const AdvertisementModel = require('../models/advertisement.model');
const ERROR = require('../utils/Error');

const createAds = async (req, res, next) => {
    const {
        title,
        desc,
        image,
        endDate,
        link,
        businessProfile,
        catg,
        keyWord,
        adsType,
    } = req.body
    try {
        const advertisement = new AdvertisementModel(
            {
                title,
                desc,
                image,
                endDate,
                link,
                advertiser: req.id,
                businessProfile,
                catg,
                adsType,
                keyWord
            }
        );
        await advertisement.save();
        res.status(201).send(advertisement);
    } catch (err) {
        next(err)
    }
};

const getAllAds = async (req, res, next) => {
    try {
        const advertisements = await AdvertisementModel.find({});
        res.send(advertisements);
    } catch (err) {
        next(err)
    }
};

const getAd = async (req, res, next) => {
    try {
        const { catg, keyword, limit } = req.query;

        const ads = await AdvertisementModel.find(
            {
                $and: [
                    { catg: { $in: [catg] } },
                    { keyWord: { $in: [keyword] } },
                    { isActive: true },
                    { status: "approved" }
                ],
            }
        ).select('_id title desc image clicks link views createdAt')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) || 2)


        if (ads.length === 0) {
            return next(ERROR(404, 'No ads found'));
        }

        res.send(ads);
        const promises = ads.map(ad => AdvertisementModel.findByIdAndUpdate(ad._id, { $inc: { views: 1 } }));
        await Promise.all(promises);

    } catch (err) {
        next(err)
    }
};

const updateAd = async (req, res, next) => {
    const { id, role } = req;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'desc', 'image', 'endDate', 'isActive', 'catg', 'keyWord', 'link',];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return next(ERROR(404, 'Invalid updates!'))
    }

    try {
        const advertisement = await AdvertisementModel.findById(req.params.id);
        if (!advertisement) {
            return next(ERROR(404, "Ad not found"))
        }
        // console.log(advertisement.advertiser.toString())
        // console.log(id)
        // console.log(advertisement.advertiser.toString() === id)

        if (advertisement.advertiser.toString() !== id) {
            return next(ERROR(401, "Unauthorized"));
        }
        if (role === "ADMIN") {
            advertisement.status = req.body.status
        } else {
            advertisement.status = "pending";
        }
        Object.assign(advertisement, req.body);
        const updatedAdvertisement = await advertisement.save();
        res.send(updatedAdvertisement);
    } catch (err) {
        next(err);
    }
};


const deleteAd = async (req, res, next) => {
    try {
        const advertisement = await AdvertisementModel.findById(req.params.id);
        if (!advertisement) {
            return next(ERROR(404, "Advertisement not found"));
        }
        if (advertisement.advertiser.toString() !== req.id) {
            return next(ERROR(401, "Unauthorized"));
        }

        const deletedAdvertisement = await AdvertisementModel.findByIdAndDelete(
            req.params.id,
            { $and: [{ advertiser: req.id }] }
        );
        if (!deletedAdvertisement) {
            return next(ERROR(404, "Advertisement not found"));
        }
        res.status(204).send();
    } catch (err) {
        next(err)
    }
};

module.exports = { createAds, getAllAds, getAd, updateAd, deleteAd };
