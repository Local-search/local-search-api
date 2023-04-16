const { verifyJwt, verifyUser, verifyAdmin, verifyIsSameUser } = require('../auth/auth.middleware')
const { getUsers, getUser, createUser, deleteUser } = require('./user.controller')

const userRoutes = require('express').Router()

userRoutes.use(verifyJwt)
userRoutes.get('/:id', verifyUser, verifyIsSameUser, getUser)
userRoutes.delete('/:id', verifyUser, verifyIsSameUser, deleteUser)
userRoutes.use(verifyAdmin)
userRoutes.get('/', getUsers)
userRoutes.post('/', createUser)

module.exports = userRoutes