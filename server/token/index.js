const pathLink = require('path').resolve('.')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const {TradeInfos} = require(pathLink + '/server/public/db/summaryDB')
// const { deflate, unzip } = require('zlib')

router.get('/token', (request, response) => {
  let params = request.query
  if (params.chainId && coinInfo[params.chainId]) {
    response.send(coinInfo[params.chainId])
  } else if (params.chainId && !coinInfo[params.chainId]) {
    response.send({})
  } else {
    response.send(coinInfo)
  }
})

let tokenList = {}

function getAllToken () {
  TradeInfos.find({}, {token: 1, exchange: 1, decimals: 1, name: 1,symbol: 1, chainID: 1}).sort({timestamp: -1}).exec((err, res) => {
    if (!err && res.length > 0) {
      for (let obj of res) {
        if (!tokenList[obj.chainID]) {
          tokenList[obj.chainID] = {}
        }
        tokenList[obj.chainID][obj.symbol] = obj
      }
    }
    setTimeout(() => {
      getAllToken()
    }, 1000 * 60 * 10)
  })
}
getAllToken()

router.get('/tokens', (request, response) => {
  response.send(tokenList)
})

module.exports = router