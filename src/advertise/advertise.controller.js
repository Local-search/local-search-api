const mongoose = require("mongoose");
const AdvertisementModel = require("../models/advertisement.model");
const ERROR = require("../utils/Error");

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
    budget,
    important,
  } = req.body;
  try {
    const advertisement = new AdvertisementModel({
      title,
      desc,
      image,
      endDate,
      link,
      advertiser: req.id,
      businessProfile,
      catg,
      adsType,
      keyWord,
      budget,
      important,
    });
    await advertisement.save();
    res.status(201).send(advertisement);
  } catch (err) {
    next(err);
  }
};

const getAllAds = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  // console.log('1', limit)

  if (isNaN(page) || isNaN(limit)) {
    return next(ERROR(400, "Invalid page or limit value"));
  }
  try {
    const count = await AdvertisementModel.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const advertisements = await AdvertisementModel.find()
      .populate("businessProfile", "name")
      .populate("advertiser", "username")
      .populate("catg")
      .skip((page - 1) * limit)
      .limit(limit)
    res.status(200).json({ result: advertisements, count, totalPages, page, limit })
  } catch (err) {
    next(err);
  }
};
const getAdsById = async (req, res, next) => {
  try {
    const advertisements = await AdvertisementModel.findById(req.params.id);
    res.send(advertisements);
  } catch (err) {
    next(err);
  }
};

const getAd = async (
  req,
  res,
  next,
  ids,
  search,
  page,
  limit,
  categorys,
  keywords,
  autoFetch
) => {
  try {
    // const { catg, keyword, limit } = req.query;
    let limits = limit;
    if (limit >= 10) {
      limits = limit - 3;
    }

    const query = {
      $or: [
        {
          important: true,
        },
      ],
      // $and: [{ status: "APPROVED" }],
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
    let textScore;
    if (search) {
      textScore = { score: { $meta: "textScore" } };
    }
    const ads = await AdvertisementModel.find(query)
      .select("_id title desc image link createdAt important budget")
      .sort(textScore)
      .skip((page - 1) * limits)
      .limit(limits)
      .select("title desc image");

    // if (ads.length === 0) {
    //   return next(ERROR(404, "No ads found"));
    // }

    const promises = ads.map((ad) =>
      AdvertisementModel.findByIdAndUpdate(ad._id, { $inc: { views: 1 } })
    );
    await Promise.all(promises);
    if (autoFetch) {
      return { ads };
    }
    res.send(ads);
  } catch (err) {
    next(err);
  }
};

const updateAd = async (req, res, next) => {
  const { id, role } = req;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "desc",
    "image",
    "endDate",
    "isActive",
    "catg",
    "keyWord",
    "link",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(ERROR(404, "Invalid updates!"));
  }

  try {
    const advertisement = await AdvertisementModel.findById(req.params.id);
    if (!advertisement) {
      return next(ERROR(404, "Ad not found"));
    }
    // console.log(advertisement.advertiser.toString())
    // console.log(id)
    // console.log(advertisement.advertiser.toString() === id)

    if (advertisement.advertiser.toString() !== id) {
      return next(ERROR(401, "Unauthorized"));
    }
    if (role === "ADMIN") {
      advertisement.status = req.body.status;
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
  const { id } = req.params;
  if (!id) {
    return next(ERROR(400, "business id is required!!"));
  }
  try {
    if (req.role === "ADMIN") {
      const advertisement = await AdvertisementModel.findByIdAndDelete(id);
      if (!advertisement) {
        return next(ERROR(404, "Advertisement not found"));
      }
      res.status(200).json({ message: "Ads deleted!", });
    } else {

      if (advertisement.advertiser.toString() !== req.id) {
        return next(ERROR(401, "Unauthorized"));
      }

      const deletedAdvertisement = await AdvertisementModel.findByIdAndDelete({
        _id: id,
        advertiser: req.id,
      });

      if (!deletedAdvertisement) {
        return next(ERROR(404, "Advertisement not found"));
      }
      res.status(200).json({ message: "Business profile deleted!", });

    }
  } catch (err) {
    next(err);
  }
};
const revenue = async (req, res, next) => {
  const date = new Date();
  // console.log(date);

  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  // console.log(lastMonth);

  const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await AdvertisementModel.aggregate([
      {
        $match: { createdAt: { $gte: prevMonth } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          earn: "$budget",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$earn" },
        },
      },
    ]);

    res.status(200).json(income);
  } catch (err) {
    next(err);
  }
};
const getFourAdvertiser = async (req, res, next) => {
  try {
    const result = await AdvertisementModel.find()
      .select("businessProfile, budget")
      .sort({ budget: -1 })
      .limit(4)
      .populate("businessProfile", "name")
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createAds,
  getAllAds,
  getAd,
  updateAd,
  deleteAd,
  getAdsById,
  revenue,
  getFourAdvertiser
};
