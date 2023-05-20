const updateStatusRoutes = require("express").Router();
const { verifyJwt, verifyAdmin } = require('../auth/auth.middleware')

const { businessStatus, UpdateAdsStatus, UpdateIsActive, ImportantAds, UpdateKeywordStatus, UpdateCatgStatus } = require("./updateStatus.controller")
updateStatusRoutes.use(verifyJwt);
updateStatusRoutes.use(verifyAdmin)
updateStatusRoutes.put("/business/:id", businessStatus)
updateStatusRoutes.put("/ads-status/:id", UpdateAdsStatus)
updateStatusRoutes.put("/ads-isactive/:id", UpdateIsActive)
updateStatusRoutes.put("/ads-important/:id", ImportantAds)
updateStatusRoutes.put("/keyword/:id", UpdateKeywordStatus)
updateStatusRoutes.put("/catg/:id", UpdateCatgStatus)
module.exports = updateStatusRoutes