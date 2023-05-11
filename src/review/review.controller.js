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
    const reviews = await ReviewModel.find({ businessProfile: businessId }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", reviews });
  } catch (err) {
    next(err);
  }
};

// const likeReview = async (req, res, next) => {
//   const { reviewId } = req.params;
//   const { id } = req;

//   try {
//     const review = await ReviewModel.findOne({ _id: reviewId }).select(
//       "likes dislikes likeCount dislikeCount user"
//     );

//     if (!review) {
//       return next(ERROR(404, "Review not found"));
//     }
//     // console.log(id === review.user.toString())
//     // console.log(id)
//     // console.log(review.user.toString())
//     if (id === review.user.toString()) {
//       return next(ERROR(409, `You cannot add like to your own review`));
//     }
//     let updateObj = {};

//     if (review.likes.includes(id)) {
//       updateObj = {
//         $pullAll: { likes: [id] },
//         $inc: { likeCount: -1 },
//       };
//       const userId = review.likes.filter(id)
//       res.status(200).json({ message: "Like removed", likeCount: - 1, userid, id: review._id });
//     } else {
//       if (review.dislikes.includes(id)) {
//         updateObj = {
//           $pullAll: { dislikes: [id] },
//           $inc: { dislikeCount: -1 },
//         };
//       }
//       updateObj = {
//         $addToSet: { likes: id },
//         $inc: { likeCount: 1 },
//       };
//       const userId = review.likes.filter(id)
//       res.status(200).json({ message: "Review liked", likeCount: + 1, userId, id: review._id });
//     }

//     await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);
//   } catch (err) {
//     next(err);
//   }
// };

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
    let likeCount;

    if (review.likes.includes(userId)) {
      updateObj = {
        $pullAll: { likes: [userId] },
        $inc: { likeCount: -1 },
      };
      message = "Like removed";
      likeCount = -1;
    } else {
      if (review.dislikes.includes(userId)) {
        updateObj = {
          $pullAll: { dislikes: [userId] },
          $inc: { dislikeCount: -1 },
        };
      }
      updateObj = {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      };
      message = "Review liked";
      likeCount = 1;
    }

    await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);

    res.status(200).json({ message, likeCount, userId, id: review._id });
  } catch (err) {
    next(err);
  }
};


// const dislikeReview = async (req, res, next) => {
//   const { reviewId } = req.params;
//   const { id } = req;

//   try {
//     const review = await ReviewModel.findOne({ _id: reviewId }).select(
//       "likes dislikes likeCount dislikeCount user"
//     );

//     if (!review) {
//       return next(ERROR(404, "Review not found"));
//     }
//     if (id === review.user.toString()) {
//       return next(ERROR(409, `You cannot add dislike to your own review`));
//     }
//     // console.log(id === review.user)
//     // console.log(id)
//     // console.log(review.user)

//     let updateObj = {};

//     if (review.dislikes.includes(id)) {
//       updateObj = {
//         $pullAll: { dislikes: [id] },
//         $inc: { dislikeCount: -1 },
//       };
//       res.status(200).json({ message: "Disike removed" });
//     } else {
//       if (review.likes.includes(id)) {
//         updateObj = {
//           $pullAll: { likes: [id] },
//           $inc: { likeCount: -1 },
//         };
//       }
//       updateObj = {
//         $addToSet: { dislikes: id },
//         $inc: { dislikeCount: 1 },
//       };
//       res.status(200).json({ message: "Review disliked" });
//     }

//     await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);
//   } catch (error) {
//     next(error);
//   }
// };

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
    let dislikeCount;

    if (review.dislikes.includes(userId)) {
      updateObj = {
        $pullAll: { dislikes: [userId] },
        $inc: { dislikeCount: -1 },
      };
      message = "Dislike removed";
      dislikeCount = -1;
    } else {
      if (review.likes.includes(userId)) {
        updateObj = {
          $pullAll: { likes: [userId] },
          $inc: { likeCount: -1 },
        };
      }
      updateObj = {
        $addToSet: { dislikes: userId },
        $inc: { dislikeCount: 1 },
      };
      message = "Review disliked";
      dislikeCount = 1;
    }

    await ReviewModel.findOneAndUpdate({ _id: reviewId }, updateObj);

    res.status(200).json({ message, dislikeCount, userId, id: review._id  });
  } catch (err) {
    next(err);
  }
};

module.exports = { CreateReview, likeReview, dislikeReview, getAllReview };
