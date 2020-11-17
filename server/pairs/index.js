const pathLink = require('path').resolve('.')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('pairs')
const $$  = require(pathLink + '/server/public/methods/tools.js')

const express = require('express'); //1
const router = express(); //2
const coininfo = require(pathLink + '/config/coininfo/index')
let tradeObj = {}
let tradeArr = []

function getTradeInfo () {
  for (let chainID in coininfo) {
    let coinList = coininfo[chainID]
    for (let obj in coinList) {
      let pair = $$.formatPairs(obj)
      let base = $$.chainIDToName(chainID)
      if (
        (pair === 'BNB' && chainID === '56')
        || (pair === 'FSN' && chainID === '32659')
        || (pair === 'FTM' && chainID === '250')
      ) continue
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