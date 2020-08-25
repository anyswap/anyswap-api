const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('pairs')
const $$  = require(pathLink + '/server/public/methods/tools.js')


const express = require('express'); //1
const router = express(); //2

let tradeObj = {}
const coinObj = coinInfo['32659']
for (let coin in coinObj) {
  if (coin.indexOf('USDT') !== -1) {
    tradeObj['FSN_' + coin] = {
      "ticker_id": 'FSN_' + coin,
      "base": "FSN",
      "target": coin,
    }
  } else {
    tradeObj[coin + '_FSN'] = {
      "ticker_id": coin + '_FSN',
      "base": coin,
      "target": "FSN",
    }
  }
}

let tradeArr = []
for (let pair in tradeObj) {
  tradeArr.push(tradeObj[pair])
}

router.get('/api/pairs', (request, response) => {
  // logger.info('request.query')
  // logger.info(request.query)
  let params = request.query
  if (params.ticker_id && params.ticker_id.indexOf('_') === -1) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  if (params.ticker_id && tradeObj[params.ticker_id]) {
    response.send(tradeObj[params.ticker_id])
  } else if (params.ticker_id && !tradeObj[params.ticker_id]) {
    response.send({})
  } else {
    response.send(tradeArr)
  }
})

module.exports = router