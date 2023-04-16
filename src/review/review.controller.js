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

        const review = new ReviewModel({
            businessProfile: businessId,
            user: id,
            rating,
            title,
            desc,
        });

        const result = await review.save();


        const reviews = await ReviewModel.find({ businessProfile: businessId }, 'rating');
        const totalReviews = reviews.length;
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRatings / totalReviews;

        await BusinessProfileModel.findByIdAndUpdate(businessId, {
            $set: { rating: avgRating, totalReviews: totalReviews },
            $addToSet: { reviews: result._id }
        }, { new: true });

        res.status(200).json({ message: 'Review added successfully' });

    } catch (error) {
        next(error);
    }

};
const getAllReview = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.find();
        res.status(200).json({ status: "success", reviews })
    } catch (err) {
        next(err)
    }
}
const likeReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { id } = req;

    try {
        const review = await ReviewModel.findById(reviewId).select(
            "likes dislikes likeCount dislikeCount"
        );

        if (!review) {
            return next(ERROR(404, "Review not found"));
        }
        if (id === review.user) {
            return next(ERROR(403, `You cannot add like to your own review`));
        }

        if (review.likes.includes(id)) {
            review.likes.pull(id);
            review.likeCount -= 1;
            res.status(200).json({ message: "remove disliked" });

        } else {
            if (review.dislikes.includes(id)) {
                review.dislikes.pull(id);
                review.dislikeCount -= 1;
            }

            review.likes.addToSet(id);
            review.likeCount += 1;

            res.status(200).json({ message: "Review liked" });
        }
        await review.save();
    } catch (err) {
        next(err);
    }
};

const dislikeReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { id } = req;

    try {
        const review = await ReviewModel.findById(reviewId).select(
            "likes dislikes likeCount dislikeCount"
        );

        if (!review) {
            return next(ERROR(404, "Review not found"));
        }
        if (id === review.user) {
            return next(ERROR(403, `you cannot add dislike to your own review`));
        }

        if (review.dislikes.includes(id)) {
            review.dislikes.pull(id);
            review.dislikeCount -= 1;
            res.status(200).json({ message: "remove disliked" });
        } else {

            if (review.likes.includes(id)) {
                review.likes.pull(id);
                review.likeCount -= 1;
            }
            review.dislikes.addToSet(id);
            review.dislikeCount += 1;
            res.status(200).json({ message: "Review disliked" });
        }
        await review.save();

    } catch (error) {
        next(error);
    }
};
module.exports = { CreateReview, likeReview, dislikeReview, getAllReview }