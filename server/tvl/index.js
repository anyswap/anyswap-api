const pathLink = require('path').resolve('.')
const express = require('express'); //1
const router = express(); //2

const ht = require(pathLink  + '/server/tvl/ht.js')

const routerPath = '/tvl'

router.use(routerPath, ht)

module.exports = router