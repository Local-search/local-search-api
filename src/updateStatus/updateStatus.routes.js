const updateStatusRoutes = require("express").Router();
const { verifyJwt, verifyAdmin } = require('../auth/auth.middleware')

const { updateKeywordStatus, updateCatgStatus, businessStatus, updateAdsStatus, UpdateIsActive, ImportantAds  } = require("./updateStatus.controller")
updateStatusRoutes.use(verifyJwt);
updateStatusRoutes.use(verifyAdmin)
updateStatusRoutes.put("/business/:id", businessStatus)
updateStatusRoutes.put("/ads-status/:id", updateAdsStatus)
updateStatusRoutes.put("/ads-isactive/:id", UpdateIsActive)
updateStatusRoutes.put("/ads-important/:id", ImportantAds)
updateStatusRoutes.put("/keyword/:id", updateKeywordStatus)
updateStatusRoutes.put("/catg/:id", updateCatgStatus)
module.exports = updateStatusRoutes