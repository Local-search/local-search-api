const { createAds, getAllAds, getAd, updateAd, deleteAd, getAdsById } = require('./advertise.controller');
const { verifyJwt, verifyAdmin, verifyUser } = require('../auth/auth.middleware');
const advertiseRoutes = require('express').Router()

advertiseRoutes.get('/', getAd)
advertiseRoutes.use(verifyJwt)
advertiseRoutes.post('/', verifyUser, createAds)


advertiseRoutes.put('/:id', verifyUser, updateAd)
advertiseRoutes.delete('/:id', verifyUser, deleteAd)

advertiseRoutes.use(verifyAdmin)
advertiseRoutes.get('/all', getAllAds)
advertiseRoutes.get('/all', getAdsById)


module.exports = advertiseRoutes;
