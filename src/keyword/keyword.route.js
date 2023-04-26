const { verifyJwt, verifyUser, verifyAdmin } = require('../auth/auth.middleware')
const { mostPopularKeyword, createKeyword, getKeywordById, getKeywords, updateKeyword, deleteKeyword } = require('./keyword.controller')
const keywordRoutes = require('express').Router()

keywordRoutes.get('/popular', mostPopularKeyword)
keywordRoutes.use(verifyJwt)
keywordRoutes.post('/', verifyUser, createKeyword)
keywordRoutes.get('/:id', getKeywordById)
keywordRoutes.get("/", verifyUser, getKeywords)
keywordRoutes.use(verifyAdmin)
keywordRoutes.put('/:id', updateKeyword)
keywordRoutes.delete('/:id', deleteKeyword)

module.exports = keywordRoutes
