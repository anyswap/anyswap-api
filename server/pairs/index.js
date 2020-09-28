const pathLink = require('path').resolve('.')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('pairs')
const $$  = require(pathLink + '/server/public/methods/tools.js')

const {TradeInfos} = require(pathLink + '/server/public/db/summaryDB')
const express = require('express'); //1
const router = express(); //2

let tradeObj = {}
let tradeArr = []

function getTradeInfo () {
  TradeInfos.find({isSwitch: 1}).sort({timestamp: -1}).exec((err, res) => {
    if (!err && res.length > 0) {
      for (let obj of res) {
        let base = $$.chainIDToName(obj.chainID)
        let pair = obj.symbol.replace('-BEP20', '').replace('-bep20', '')
        if (pair.indexOf('USDT') !== -1) {
          tradeObj[base + '_' + pair] = {
            "ticker_id": base + '_' + pair,
            "base": base,
            "target": pair,
          }
          tradeArr.push(tradeObj[base + '_' + pair])
        } else {
          tradeObj[pair + '_' + base] = {
            "ticker_id": pair + '_' + base,
            "base": pair,
            "target": base,
          }
          tradeArr.push(tradeObj[pair + '_' + base])
        }
      }
    }
    setTimeout(() => {
      getTradeInfo()
    }, 1000 * 60 * 10)
  })
}

getTradeInfo()

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