const pathLink = require("path").resolve(".")

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const config = require(__dirname + '/config')
const logger = require(__dirname + '/server/public/methods/log4js').getLogger('App')

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,GZIP')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  // res.send(pathLink + '/dist/index.html')
  next()
})
app.use(express.static(require('path').join(__dirname, 'server')))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const historical = require(pathLink  + '/server/historical/index.js')
const pairs = require(pathLink  + '/server/pairs/index.js')
const tickers = require(pathLink  + '/server/tickers/index.js')
const orderbook = require(pathLink  + '/server/orderbook/index.js')
const token = require(pathLink  + '/server/token/index.js')
const tokenList = require(pathLink  + '/server/token/anyToken.js')
const supply = require(pathLink  + '/server/supply/index.js')
const assets = require(pathLink  + '/server/assets/index.js')

app.use('/', historical)
app.use('/', pairs)
app.use('/', tickers)
app.use('/', orderbook)
app.use('/', token)
app.use('/', tokenList)
app.use('/', supply)
app.use('/', assets)

app.listen(config.apiPort, () => {
  logger.info(config.apiPort + ' start success!')
})