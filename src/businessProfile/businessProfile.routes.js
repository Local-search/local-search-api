const { createBusinessProfile, getBusinessProfileById, getAllBusinessProfile } = require('./businessProfile.controller')

const businessProfileRoutes = require('express').Router()

businessProfileRoutes.post('/', createBusinessProfile)
businessProfileRoutes.get('/:id', getBusinessProfileById)
businessProfileRoutes.get('/', getAllBusinessProfile)

module.exports = businessProfileRoutes