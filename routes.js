const routes = require("express").Router()
const advertiseRoutes = require("./src/advertise/advertise.routes")
const authRoutes = require("./src/auth/auth.routes")
const businessProfileRoutes = require("./src/businessProfile/businessProfile.routes")
const reviewsRoutes = require("./src/review/review.routes")
const userRoutes = require("./src/users/user.routes")

routes.use('/auth', authRoutes)
routes.use('/users', userRoutes)
routes.use('/review', reviewsRoutes)
routes.use('/business', businessProfileRoutes)
routes.use('/ads', advertiseRoutes)

module.exports = routes