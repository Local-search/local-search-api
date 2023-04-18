const { verifyJwt } = require("../auth/auth.middleware");
const BusinessProfileModel = require("../models/businessProfile.model");
const CategoryModel = require("../models/category.model");
const KeywordModel = require("../models/keyWord.model");
const ERROR = require("../utils/Error");

exports.createBusinessProfile = async (req, res, next) => {
    const {
        status,
        rating,
        reviews,
        totalReviews,
        businessInfoUpdateAt,
        ...otherData
    } = req.body;
    try {
        const businessProfile = new BusinessProfileModel({
            ...otherData,
        });
        await businessProfile.save();
        res.status(201).json(businessProfile);
    } catch (err) {
        next(err);
    }
};
exports.getAllBusinessProfile = async (req, res, next) => {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    console.log('1', limit)

    if (isNaN(page) || isNaN(limit)) {
        return next(ERROR(400, "Invalid page or limit value"));
    }

    if (limit >= 15) {
        verifyJwt(req, res, () => {
            if (req?.role !== "ADMIN") {
                limit = 15
            }
            // console.log(req.role !== "ADMIN")
        })
    }

    console.log('2', limit)
    if (!search)
        return next(
            ERROR(
                401,
                "enter the name, ctag, keyword, business name, email, phone number that you want to search"
            )
        );
    if (search.length <= 2)
        return next(ERROR(401, "please enter 3 more letters"));

    const ids = [];
    const categorys = await CategoryModel.findOne({
        $text: { $search: search },
        $and: [{ status: "true" }],
    })
        .sort({ score: { $meta: "textScore" } })
        .select("_id")
        .exec();
    ids.push(categorys?._id);
    console.log(categorys);
    const keywords = await KeywordModel.findOne({
        $text: { $search: search },
        $and: [{ status: "true" }],
    })
        .sort({ score: { $meta: "textScore" } })
        .select("_id")
        .exec();
    ids.push(keywords?._id);

    console.log(keywords);
    console.log(ids);

    try {
        const query = {
            $or: [],
            $and: [{ status: "true" }],
        };
        if (categorys) {
            query.$or.push({ catg: { $in: ids } });
        }
        if (keywords) {
            query.$or.push({ keyWord: { $in: ids } });
        }
        if (search) {
            query.$or.push({ $text: { $search: search } });
        }
        console.log(query);

        const count = await BusinessProfileModel.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        const businessProfiles = await BusinessProfileModel.find(query)
            .populate({
                path: "catg",
                select: "label",
            })
            .populate({
                path: "keyWord",
                select: "label",
            })
            .sort({
                _id: -1,
                score: { $meta: "textScore" },
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("name address catg keyWord site time rating totalReviews status")
            .lean()
            .exec();

        res.status(200).json({
            count,
            totalPages,
            currentPage: page,
            businessProfiles,
        });
    } catch (err) {
        next(err);
    }
};

exports.getBusinessProfileById = async (req, res, next) => {

    try {
        const businessProfile = await BusinessProfileModel.findById(req.params.id, { $and: [{ status: "true" }] })
            .select(
                "name phone email address location catg keyword postBox establishIn site socailMedia openAllTime time days reviews rating totalReviews status"
            )
            .populate("catg", { $and: [{ status: "true" }] }, "lable")
            .populate("keyWord", { $and: [{ status: "true" }] }, "lable")
            .populate("reviews", "title desc likeCount dislikeCount");
        if (!businessProfile) {
            return next(ERROR(404, "Business profile not found"));
        }
        res.status(200).json(businessProfile);
    } catch (err) {
        next(err);
    }
};

exports.updateBusinessProfileById = async (req, res, next) => {
    const {
        status,
        rating,
        reviews,
        totalReviews,
        businessInfoUpdateAt,
        ...otherData
    } = req.body;
    try {
        const businessProfile = await BusinessProfileModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: [
                    ...otherData,
                    { businessInfoUpdateAt: new Date() },
                    { status: "false" }
                ]
            },
            { new: true }
        );
        if (!businessProfile) {
            return next(ERROR(404, "Business profile not found"));
        }
        res.status(200).json(businessProfile);
    } catch (err) {
        next(err);
    }
};

exports.deleteBusinessProfileById = async (req, res, next) => {
    try {
        const businessProfile = await BusinessProfileModel.findByIdAndDelete(
            req.params.id
        );
        if (!businessProfile) {
            return next(ERROR(404, "Business profile not found"));
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};