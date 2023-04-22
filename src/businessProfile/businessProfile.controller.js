const { getAd } = require("../advertise/advertise.controller");
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
  // console.log('1', limit)

  if (isNaN(page) || isNaN(limit)) {
    return next(ERROR(400, "Invalid page or limit value"));
  }

  if (limit >= 25) {
    verifyJwt(req, res, () => {
      if (req?.role !== "ADMIN") {
        limit = 25;
      }
      // console.log(req.role !== "ADMIN")
    });
  }

  // console.log('2', limit)
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
  if (categorys) {
    ids.push(categorys?._id);
    await CategoryModel.updateOne(
      { _id: categorys._id },
      { $inc: { popular: 1 } }
    );
  }
  console.log(categorys);
  const keywords = await KeywordModel.findOne({
    $text: { $search: search },
    $and: [{ status: "true" }],
  })
    .sort({ score: { $meta: "textScore" } })
    .select("_id")
    .exec();
  if (keywords) {
    ids.push(keywords?._id);
    await KeywordModel.updateOne(
      { _id: keywords._id },
      { $inc: { popular: 1 } }
    );
  }

  //console.log(keywords);
  // console.log(ids);

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
    //console.log(query);
    const { ads } = await getAd(
      req,
      res,
      next,
      ids,
      search,
      page,
      limit,
      categorys,
      keywords,
      (autoFetch = true)
    );

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
        // _id: -1,
        popular: -1,
        rating: -1,
        totalReviews: -1,
        score: { $meta: "textScore" },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "name address catg keyWord site time rating totalReviews status popular"
      )
      .lean()
      .exec();
    
    res.status(200).json({
      count,
      totalPages,
      currentPage: page,
      ads: ads,
      businessProfiles,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBusinessProfileById = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfileModel.findOne({
      _id: req.params.id,
      $and: [
        {
          status: "true",
        },
      ],
    })

      .select(
        "name phone email address location catg keyword postBox establishIn site socailMedia openAllTime time days reviews rating totalReviews status popular"
      )
      .populate("catg", "label", { $and: [{ status: "true" }] })
      .populate("keyWord", "label", { $and: [{ status: "true" }] })
      .populate("reviews", "title desc likeCount dislikeCount")
      .exec();
    if (businessProfile) {
      await BusinessProfileModel.updateOne(
        { _id: businessProfile._id },
        { $inc: { popular: 1 } }
      );
    } else {
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
          { status: "false" },
        ],
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