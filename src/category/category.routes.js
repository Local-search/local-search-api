const { verifyJwt, verifyUser, verifyAdmin } = require('../auth/auth.middleware')
const { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory } = require('./category.controller')

const categoryRoutes = require('express').Router()

categoryRoutes.use(verifyJwt)
categoryRoutes.post('/', verifyUser, createCategory)
categoryRoutes.get('/:id', getCategoryById)
categoryRoutes.get("/", verifyUser, getCategories)
categoryRoutes.use(verifyAdmin)
categoryRoutes.put('/:id', updateCategory)
categoryRoutes.delete('/:id', deleteCategory)

module.exports = categoryRoutes