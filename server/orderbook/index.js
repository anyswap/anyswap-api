const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('orderbook')
const $$  = require(pathLink + '/server/public/methods/tools.js')


const express = require('express'); //1
const router = express(); //2

const tradeObj = {
  'ANY_FSN':  {
    "ticker_id": "ANY_FSN",
    "base": "ANY",
    "target": "FSN",
  }
}

let tradeArr = []
for (let pair in tradeObj) {
  tradeArr.push(tradeObj[pair])
}

router.get('/orderbook', (request, response) => {
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