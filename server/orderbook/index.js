const pathLink = require('path').resolve('.')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('orderbook')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')
const express = require('express'); //1
const router = express(); //2

const ERC20 = require(pathLink + '/server/public/ABI/erc20.json')
const EXCHANGE = require(pathLink + '/server/public/ABI/exchange.json')
const FACTORY = require(pathLink + '/server/public/ABI/factory.json')
const SWAPBTCABI = require(pathLink + '/server/public/ABI/swapBTCABI.js')
const SWAPETHABI = require(pathLink + '/server/public/ABI/swapETHABI.js')
const ethers = require('ethers')
const NODE = require(pathLink + '/config/node.json')
const web3 = require(pathLink + '/server/public/web3/index.js')

let coinObj = {}

const {TradeInfos} = require(pathLink + '/server/public/db/summaryDB')

function getCoinInfo () {
  TradeInfos.find().exec((err, res) => {
    if (!err && res.length > 0) {
      for (let obj of res) {
        if (!coinObj[obj.chainID]) {
          coinObj[obj.chainID] = {}
        }
        let pair = $$.formatPairs(obj.symbol)
        coinObj[obj.chainID][pair] = obj
      }
    }
    setTimeout(() => {
      getCoinInfo()
    }, 1000 * 60 * 10)
  })
}
getCoinInfo()


function calculateBS (x, y, pecent, isNegative, IS_USDT) {
  pecent = isNegative === '+' ? Number(pecent) / 10000 : -Number(pecent) / 10000
  let fee = 0.004
  let a = Number(y)
  let b = 2 * y * x - (1 + pecent) * fee * x * y
  let c = isNegative === '+' ? (-pecent * x * x *y) : (pecent * x * x *y)
  let result = b * b - 4 * a * c
  let result1 = -b / (2 * a) + Math.sqrt(result) / ( 2 * a )
  let markets = (x / y) * (1 + pecent)
  if (IS_USDT) {
    markets = 1 / markets
  }
  return [markets.toFixed(5), result1.toString()]
}

function getAmount (depth, pair, IS_USDT, chainID) {
  return new Promise(resolve => {
    web3.setProvider(NODE[chainID].url)
    async.waterfall([
      (cb) => {
        let contract = new web3.eth.Contract(ERC20, coinObj[chainID][pair].token)
        contract.methods.balanceOf(coinObj[chainID][pair].exchange).call({from: coinObj[chainID][pair].exchange}, (err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log(res)
          cb(null, balance)
        })
      },
      (balance, cb) => {
        web3.eth.getBalance(coinObj[chainID][pair].exchange).then(res => {
          // console.log(res)
          cb(null, {
            fsn: res,
            token: balance
          })
        })
      },
      (obj, cb) => {
        let x = Number($$.fromWei(obj.fsn))
        let y = Number($$.fromWei(obj.token, coinObj[chainID][pair].decimals))
        let data = {
          ticker_id: pair + '_' + $$.chainIDToName(chainID),
          timestamp: parseInt(Date.now() / 1000).toString(),
          bids: [
            calculateBS(x, y, depth / 2, '+', IS_USDT),
            calculateBS(x, y, depth, '+', IS_USDT)
          ],
          asks: [
            calculateBS(x, y, depth / 2, '-', IS_USDT),
            calculateBS(x, y, depth, '-', IS_USDT)
          ]
        }
        // console.log(calculateBuyAndSell(x, y, depth))
        cb(null, data)
      }
    ], (err, res) => {
      // console.log('res')
      // console.log(res)
      resolve(res)
    })
  })
}

router.get('/orderbook/:market_pair/:depth/:level', (request, response) => {
  // logger.info('request.query')
  let params = request.params
  logger.info(params)
  if (!params.market_pair || (params.market_pair && params.market_pair.indexOf('_') === -1)) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  const IS_USDT = params.market_pair.indexOf('USDT') !== -1
  // let pairs = IS_USDT ? params.market_pair.split('_')[1] : params.market_pair.split('_')[0]
  let pairObj = $$.getPair(params.market_pair)
  let pairs = pairObj.pair
  let chainID = $$.nameToChainID(pairObj.base)
  if (params.market_pair && coinObj[chainID] && coinObj[chainID][pairs]) {
    getAmount(params.depth, pairs, IS_USDT, chainID).then(res => {
      let data = {
        timestamp: Number(res.timestamp) * 1000 + '',
        bids: res.bids,
        asks: res.asks
      }
      response.send(data)
    })
  } else if (params.market_pair && (!coinObj[chainID] || !coinObj[chainID][pairs])) {
    response.send({})
  } else {
    response.send({})
  }
})

router.get('/api/orderbook', (request, response) => {
  // logger.info('request.query')
  // logger.info(request.query)
  let params = request.query
  if (!params.ticker_id || (params.ticker_id && params.ticker_id.indexOf('_') === -1)) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  const IS_USDT = params.ticker_id.indexOf('USDT') !== -1
  // let pairs = IS_USDT ? params.ticker_id.split('_')[1] : params.ticker_id.split('_')[0]
  let pairObj = $$.getPair(params.ticker_id)
  let pairs = pairObj.pair
  let chainID = $$.nameToChainID(pairObj.base)
  if (params.ticker_id && coinObj[chainID] && coinObj[chainID][pairs]) {
    getAmount(params.depth, pairs, IS_USDT, chainID).then(res => {
      response.send(res)
    })
  } else if (params.ticker_id && (!coinObj[chainID] || !coinObj[chainID][pairs])) {
    response.send({})
  } else {
    response.send({})
  }
})

module.exports = router