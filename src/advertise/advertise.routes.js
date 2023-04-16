const { createAds, getAllAds, getAd, updateAd, deleteAd } = require('./advertise.controller');
const { verifyJwt, verifyAdmin, verifyUser } = require('../auth/auth.middleware');
const advertiseRoutes = require('express').Router()

advertiseRoutes.get('/', getAd)
advertiseRoutes.use(verifyJwt)
advertiseRoutes.post('/', verifyUser, createAds)


advertiseRoutes.patch('/:id', verifyUser, updateAd)
advertiseRoutes.delete('/:id', verifyUser, deleteAd)


advertiseRoutes.get('/all', verifyAdmin, getAllAds)

module.exports = advertiseRoutes;
