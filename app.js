const pathLink = require("path").resolve(".")

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const config = require(__dirname + '/config')
const logger = require(__dirname + '/server/public/methods/log4js').getLogger('App')

const httpPort =  config.apiPort



app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  // res.send(pathLink + '/dist/index.html')
  next()
})
app.use(express.static(require('path').join(__dirname, 'server')))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))