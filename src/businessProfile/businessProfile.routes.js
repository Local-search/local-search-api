const { verifyUser, verifyJwt, verifyIsSameUser } = require('../auth/auth.middleware')
const { createBusinessProfile, getBusinessProfileById, getAllBusinessProfile, updateBusinessProfileById, deleteBusinessProfileById } = require('./businessProfile.controller')

const businessProfileRoutes = require('express').Router()
businessProfileRoutes.get('/:id', getBusinessProfileById)
businessProfileRoutes.get('/', getAllBusinessProfile)
businessProfileRoutes.use(verifyJwt)
businessProfileRoutes.post('/', verifyUser, createBusinessProfile)
businessProfileRoutes.put('/:id', verifyIsSameUser, updateBusinessProfileById)
businessProfileRoutes.delete('/:id', verifyIsSameUser, deleteBusinessProfileById)
module.exports = businessProfileRoutes