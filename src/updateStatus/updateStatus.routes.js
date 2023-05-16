const updateStatusRoutes = require("express").Router();
const { verifyJwt, verifyAdmin } = require('../auth/auth.middleware')

const { businessStatus } = require("./updateStatus.controller")
updateStatusRoutes.use(verifyJwt);
updateStatusRoutes.use(verifyAdmin)
updateStatusRoutes.put("/business/:id", businessStatus)

module.exports = updateStatusRoutes