const { createAds, getFourAdvertiser, getAllAds, getAd, updateAd, deleteAd, getAdsById, revenue } = require('./advertise.controller');
const { verifyJwt, verifyAdmin, verifyUser } = require('../auth/auth.middleware');
const advertiseRoutes = require('express').Router()

advertiseRoutes.get('/', getAd)
advertiseRoutes.get('/businessProfile', getFourAdvertiser)
advertiseRoutes.use(verifyJwt)
advertiseRoutes.post('/', verifyUser, createAds)

advertiseRoutes.get('/revenue', verifyAdmin, revenue)
advertiseRoutes.get('/all', verifyAdmin, getAllAds)
advertiseRoutes.delete('/:id', verifyUser, deleteAd)
advertiseRoutes.put('/:id', verifyUser, updateAd)
advertiseRoutes.get('/:id', verifyAdmin, getAdsById)


module.exports = advertiseRoutes;
