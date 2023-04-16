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

const getAllAds = async (req, res) => {
    try {
        const advertisements = await AdvertisementModel.find({});
        res.send(advertisements);
    } catch (error) {
        res.status(500).send(error);
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

const updateAd = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'desc', 'image', 'endDate', 'views', 'isActive', 'catg', 'keyWord', 'link',];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const advertisement = await AdvertisementModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!advertisement) {
            return res.status(404).send();
        }
        res.send(advertisement);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteAd = async (req, res) => {
    try {
        const advertisement = await AdvertisementModel.findByIdAndDelete(req.params.id);
        if (!advertisement) {
            return res.status(404).send();
        }
        res.send(advertisement);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { createAds, getAllAds, getAd, updateAd, deleteAd };
