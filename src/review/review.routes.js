const { verifyJwt, verifyUser, } = require('../auth/auth.middleware')
const { CreateReview, likeReview, dislikeReview, getAllReview } = require('./review.controller')

const reviewsRoutes = require('express').Router()
reviewsRoutes.get('/:businessId', getAllReview)
reviewsRoutes.use(verifyJwt)
reviewsRoutes.use(verifyUser)
reviewsRoutes.post('/:businessId', CreateReview)
reviewsRoutes.put('/like/:reviewId', likeReview)
reviewsRoutes.put('/dislike/:reviewId', dislikeReview)

module.exports = reviewsRoutes