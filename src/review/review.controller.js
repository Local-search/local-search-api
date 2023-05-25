const BusinessProfileModel = require("../models/businessProfile.model");
const ReviewModel = require("../models/review.model");
const ERROR = require("../utils/Error");

const CreateReview = async (req, res, next) => {
  const { businessId } = req.params;
  const { rating, title, desc } = req.body;
  const { id } = req;

  try {
    const business = await BusinessProfileModel.findById(businessId);

    if (!business) {
      return next(ERROR(404, "Business profile not found"));
    }

    // const review = new ReviewModel({
    //   businessProfile: businessId,
    //   user: id,
    //   rating,
    //   title,
    //   desc,
    // });

    // const result = await review.save();
    const filter = { businessProfile: businessId, user: id };
    const update = {
      businessProfile: businessId,
      user: id,
      rating,
      title,
      desc,
    };
    const options = { upsert: true, new: true, runValidators: true };

    const result = await ReviewModel.findOneAndUpdate(filter, update, options);
    if (!result) {
      return next(ERROR(401, "sothing went wrong"))
    }

    const reviews = await ReviewModel.find(
      { businessProfile: businessId },
      "rating"
    );
    const totalReviews = reviews.length;
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const avgRating = (totalRatings / totalReviews).toFixed(1);

    await BusinessProfileModel.findByIdAndUpdate(
      businessId,
      {
        $set: { rating: avgRating, totalReviews: totalReviews },
        $addToSet: { reviews: result._id },
      },
      { new: true }
    );

    res.status(200).json({ result, message: "Review added successfully" });
  } catch (error) {
    next(error);
  }
};
const getAllReview = async (req, res, next) => {
  const { businessId } = req.params;

  try {
    const reviews = await ReviewModel.find({ businessProfile: businessId }).sort({ _id: -1 }).populate("user", "username");
    res.status(200).json({ status: "success", reviews });
  } catch (err) {
    next(err);
  }
};


const likeReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { id: userId } = req;

  try {
    const review = await ReviewModel.findOne({ _id: reviewId })
      .select("likes dislikes likeCount dislikeCount user");

    if (!review) {
      return next(ERROR(404, "Review not found"));
    }

    if (userId === review.user.toString()) {
      return next(ERROR(409, "You cannot like your own review"));
    }

    let updateObj = {};
    let message;
    let countChange;
    let countRemove;

    if (review.dislikes.includes(userId)) {
      updateObj = {
        $pullAll: { dislikes: [userId] },
        $inc: { dislikeCount: -1, likeCount: 1 },
        $addToSet: { likes: userId }
      };
      message = "Review liked";
      countChange = 1;
      countRemove = -1;
    } else if (review.likes.includes(userId)) {
      updateObj = {
        $pullAll: { likes: [userId] },
        $inc: { likeCount: -1 }
      };
      message = "Like removed";
      countChange = -1;
    } else {
      updateObj = {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 }
      };
      message = "Review liked";
      countChange = 1;
    }

    await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);

    res.status(200).json({ message, countChange, countRemove, userId, id: review._id });
  } catch (err) {
    next(err);
  }
};



const dislikeReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { id: userId } = req;

  try {
    const review = await ReviewModel.findOne({ _id: reviewId })
      .select("likes dislikes likeCount dislikeCount user");

    if (!review) {
      return next(ERROR(404, "Review not found"));
    }

    if (userId === review.user.toString()) {
      return next(ERROR(409, "You cannot dislike your own review"));
    }

    let updateObj = {};
    let message;
    let countChange;
    let countRemove;

    if (review.likes.includes(userId)) {
      updateObj = {
        $pullAll: { likes: [userId] },
        $inc: { likeCount: -1, dislikeCount: 1 },
        $addToSet: { dislikes: userId }
      };
      message = "Review disliked";
      countChange = 1;
      countRemove = -1;
    } else if (review.dislikes.includes(userId)) {
      updateObj = {
        $pullAll: { dislikes: [userId] },
        $inc: { dislikeCount: -1 }
      };
      message = "Dislike removed";
      countChange = -1;
    } else {
      updateObj = {
        $addToSet: { dislikes: userId },
        $inc: { dislikeCount: 1 }
      };
      message = "Review disliked";
      countChange = 1;
    }

    await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);

    res.status(200).json({ message, countRemove, countChange, userId, id: review._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { CreateReview, likeReview, dislikeReview, getAllReview };
