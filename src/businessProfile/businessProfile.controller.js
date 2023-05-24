const { promises } = require("nodemailer/lib/xoauth2");
const { getAd } = require("../advertise/advertise.controller");
const { verifyJwt } = require("../auth/auth.middleware");
const BusinessProfileModel = require("../models/businessProfile.model");
const CategoryModel = require("../models/category.model");
const KeywordModel = require("../models/keyWord.model");
const ERROR = require("../utils/Error");

const createBusinessProfile = async (req, res, next) => {
  const { name, phone, email, address, province, city, ward, tolOrMarga, logo, categorys, keywords, postBox, establishIn, nosite, site, instagram, facebook, twitter, lng, lat, openAllDayAndWeek, openingTime, closingTime, openingDays, services, role, message, TermsAndConditions,
  } = req.body;
  if (!name) {
    return next(ERROR(400, "enter you Business name!"))
  }
  if (!address) {
    return next(ERROR(400, "enter you Business address!"))
  }
  if (!establishIn) {
    return next(ERROR(400, "enter the year your business establish In !"))
  }
  if (!role) {
    return next(ERROR(400, "enter the role / position you current have in this business!"))
  }
  if (TermsAndConditions !== "agree") {
    return next(ERROR(405, "sorry if you do not agree with our terms & conditions then we cannot list your business in local search!"))
  }
  if (!categorys) {
    return next(ERROR(400, "choose category related to your business"))
  }
  if (!keywords) {
    return next(ERROR(400, "choose keywords related to your business"))
  }
  const isNewCategoriesCount = categorys.filter(category => category.__isNew__).length;
  if (isNewCategoriesCount > 4) {
    return next(ERROR(405, "you cannot create more then 4 categorys!"))
  }
  const isNewKeywordsCount = keywords.filter(keyword => keyword.__isNew__).length;
  if (isNewKeywordsCount > 4) {
    return next(ERROR(405, "you cannot create more then 4 keywords!"))
  }
  let data = {
    name, phone, email, address, logo, postBox, establishIn, TermsAndConditions,
    formFillerInfo: { role, message, userId: req.id },
    location: { lat, lng },
    socailMedia: { insta: instagram, fb: facebook, twitter },
    province: { name: province, city, ward, tolOrMarga },
    services,
  }

  if (nosite) {
    data.push(site = '')
  } else if (site) {
    data.push(nosite = false)
  }

  if (openAllDayAndWeek) {
    data.time = {};
    data.days = []
  } else if (openingTime && !closingTime) {
    return next(ERROR(400, "enter closing time"))
  } else if (closingTime && !openingTime) {
    return next(ERROR(400, "enter opening time"))
  } else if (!openAllDayAndWeek) {
    return next(ERROR(400, "select opening days"))
  } else if (openingTime && closingTime) {
    data.openAllDayAndWeek = false;
    data.time = { from: openingTime, to: closingTime };
    data.days = [openingDays]
  }
  try {
    const catg = [];
    const categoryPromises = [];
    const uniqueLabels = new Set();

    if (categorys) {
      for (const category of categorys) {
        if (category.__isNew__) {
          const { label } = category;
          if (uniqueLabels.has(label)) {
            // Throw an error or handle the duplicate label case
            return next(ERROR(400, "Duplicate category detected"));
          }
    
          uniqueLabels.add(label);
          const newCategory = new CategoryModel({ label, creator: req.id });

          // Create a promise for saving the new category
          const categoryPromise = newCategory.save();
          categoryPromises.push(categoryPromise);

          // Add the promise to the array of category promises
          categoryPromises.push(categoryPromise);

          // After the category is saved, access the new category ID
          categoryPromise.then(savedCategory => {
            const newCategoryId = savedCategory._id;

            // Add the new category ID to the catg array
            catg.push(newCategoryId);
          });
        } else {
          // Add the value of categories without __isNew__ to the catg array
          catg.push(category.value);
        }
      }

      // Wait for all category creation promises to resolve
      await Promise.all(categoryPromises);
    }

    const keyWord = []
    const keywordPromises = []
    if (keywords) {
      for (const keyword of keywords) {
        if (keyword.__isNew__) {
          const { label } = keyword;

          if (uniqueLabels.has(label)) {
            return next(ERROR(400, "Duplicate keyword detected"));
          }
    
          uniqueLabels.add(label);

          const newKeyword = new KeywordModel({ label, creator: req.id });
          const keywordPromise = newKeyword.save()
          keywordPromises.push(keywordPromise)
          keywordPromises.push(keywordPromise)
          keywordPromise.then(savedKeyword => {
            const newKeywordId = savedKeyword._id;
            keyWord.push(newKeywordId)
          })
        } else {
          keyWord.push(keyword.value)
        }
      }

      await Promise.all(keywordPromises)
    }

    if (catg) {
      data.catg = catg
    }
    if (keyWord) {
      data.keyWord = keyWord
    }


    const businessProfile = new BusinessProfileModel(data);

    const newBusiness = await businessProfile.save();
    res.status(201).json({ message: "Business profile created successfully!", newBusiness });
  } catch (err) {
    next(err);
  }
};


const getAllBusinessProfile = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  // console.log('1', limit)

  if (isNaN(page) || isNaN(limit)) {
    return next(ERROR(400, "Invalid page or limit value"));
  }
  try {
    const count = await BusinessProfileModel.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const allProfiles = await BusinessProfileModel.find().skip((page - 1) * limit)
      .limit(limit)
    res.status(200).json({ result: allProfiles, count, totalPages, page, limit })
  } catch (err) {
    next(err)
  }
}
const searchBusiness = async (
  query,
  ids,
  search,
  categorys,
  keywords,
  req,
  res,
  next
) => {
  let page = parseInt(req.query.page) || 1;
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
  try {
    const count = await BusinessProfileModel.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    if (page > totalPages) {
      page = 1;
    }
    const sortParams = {
      rating: -1,
      totalReviews: -1,
      popular: -1,
    };
    if (search) {
      sortParams.score = { $meta: "textScore" };
    }
    const businessProfiles = await BusinessProfileModel.find(query)
      .populate({
        path: "catg",
        select: "label",
      })
      .populate({
        path: "keyWord",
        select: "label",
      })
      .sort(sortParams)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "name address catg keyWord site time rating totalReviews status popular logo"
      )
      .lean()
      .exec();
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
    // console.log(businessProfiles, count, totalPages, ads, page);
    res.send({ page, count, totalPages, businessProfiles, ads });
  } catch (err) {
    next(err);
  }
};


const getSearchBusinessProfile = async (req, res, next) => {
  const { search } = req.query;

  if (!search)
    return next(
      ERROR(
        401,
        "enter the name, ctag, keyword, business name, email, phone number that you want to search"
      )
    );
  if (search.length <= 2)
    return next(ERROR(401, "please enter at lest 3 letters"));

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

    await searchBusiness(
      query,
      ids,
      search,
      categorys,
      keywords,
      req,
      res,
      next
    );
  } catch (err) {
    next(err);
  }
};
const getBusinessWithCatgId = async (req, res, next) => {
  const { ids } = req.params;
  if (!ids) return next(ERROR(401, "catg is required!"));

  try {
    const query = {
      $or: [{ catg: { $in: ids } }],
      $and: [{ status: "true" }],
    };

    await searchBusiness(
      query,
      ids,
      (search = false),
      (categorys = true),
      (keywords = false),
      req,
      res,
      next
    );
  } catch (err) {
    next(err);
  }
};
const getBusinessWithKeywordId = async (req, res, next) => {
  const { ids } = req.params;
  if (!ids) return next(ERROR(401, "catg is required!"));

  try {
    const query = {
      $or: [{ keyWord: { $in: ids } }],
      $and: [{ status: "true" }],
    };

    await searchBusiness(
      query,
      ids,
      (search = false),
      (categorys = false),
      (keywords = true),
      req,
      res,
      next
    );
  } catch (err) {
    next(err);
  }
};

const getBusinessProfileById = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfileModel.findOne({
      _id: req.params.id,
      status: "true",
    })

      .select(
        "name phone email address location catg keyword postBox establishIn site nosite socailMedia openAllTime time days reviews rating totalReviews status popular logo"
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

const updateBusinessProfileById = async (req, res, next) => {
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
      {
        _id: req.params.id,
        "formFillerInfo.userId": req.id,
      },
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

const deleteBusinessProfileById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(ERROR(400, "business id is required!!"));
  }
  try {
    if (req.role === "ADMIN") {
      const businessProfile = await BusinessProfileModel.findByIdAndDelete(id);
      if (!businessProfile) {
        return next(ERROR(401, "Business profile not found"));
      }
      res.status(200).json({ message: "Business profile deleted!", });
    } else {
      const businessProfile = await BusinessProfileModel.findOneAndDelete({
        _id: id,
        "formFillerInfo.userId": req.id,
      });
      if (!businessProfile) {
        return next(ERROR(401, "Business profile not found"));
      }
      res.status(200).json({ message: "Business profile deleted!", });
    }
  } catch (err) {
    next(err);
  }
};
const TrendingBusiness = async (req, res, next) => {
  try {
    const business = await BusinessProfileModel.find({ status: "true" })
      .sort({ popular: -1 })
      .limit(4);
    res.status(200).json({ business });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createBusinessProfile,
  getBusinessProfileById,
  getAllBusinessProfile,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  TrendingBusiness,
  getBusinessWithKeywordId,
  getBusinessWithCatgId,
  getSearchBusinessProfile
};
