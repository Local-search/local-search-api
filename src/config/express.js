const express = require('express')
const cors = require('cors')
const errorHandler = require('../utils/errorHandler.middleware')
const routes = require('../../routes')
const cookieParser = require('cookie-parser')
const app = express()

app.use(cors({ origin: 'https://ngr-np-ideal-winner-j9vvvp5qj6j2jqq9-5173.preview.app.github.dev' }))
app.use(express.json())
app.use(cookieParser());
app.use(routes)
app.use(errorHandler)

app.use('*', (_, res, next) => {
    res.status(404).json("routes not avaliable on this name ⛔")
});


module.exports = app