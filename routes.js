const routes = require("express").Router()
const authRoutes = require("./src/auth/auth.routes")
const userRoutes = require("./src/users/user.routes")

routes.use('/auth', authRoutes)
routes.use('/users', userRoutes)

module.exports = routes