const route = require('express').Router()
const userRoute = require('./userRoute')
const villageRoute = require('./villageRoute')
const transactionRoute = require('./transactionRoute')
const suggestionRoute = require('./suggestioRoute')
const adminRoute = require('./adminRoute')
const { authenticate } = require('../middlewares/auth')

route.use('/user', userRoute)

route.use('/admin', adminRoute)

route.use(authenticate)

route.use('/villagers', villageRoute)

route.use('/transactions', transactionRoute)

route.use('/suggestions', suggestionRoute)

module.exports = route
