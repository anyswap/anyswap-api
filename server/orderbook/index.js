const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
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
const web3 = require(pathLink + '/server/public/web3/index.js')


function calculateBuy (x, y, pecent) {
  pecent = Number(pecent) / 10000
  let fee = 0.004
  let a = Number(y)
  let b = 2 * y * x - (1 + pecent) * fee * x * y
  let c = -pecent * x * x *y
  let result = b * b - 4 * a * c
  let result1 = -b / (2 * a) + Math.sqrt(result) / ( 2 * a )
  let markets = (x / y) * (1 + pecent)
  return [markets.toFixed(5), result1.toString()]
}

function calculateSell (x, y, pecent) {
  pecent = -Number(pecent) / 10000
  let fee = 0.004
  let a = Number(y)
  let b = 2 * y * x - (1 + pecent) * fee * x * y
  let c = pecent * x * x * y
  let result = b * b - 4 * a * c
  let result1 = -b / (2 * a) + Math.sqrt(result) / ( 2 * a )
  // let result2 = -b / (2 * a) - Math.sqrt(result) / ( 2 * a )
  // console.log(result2)
  let markets = (x / y) * (1 + pecent)
  return [markets.toFixed(5), result1.toString()]
}

function getAmount (depth, pair) {
  return new Promise(resolve => {
    async.waterfall([
      (cb) => {
        let contract = new web3.eth.Contract(ERC20, coinInfo[pair].token)
        contract.methods.balanceOf(coinInfo[pair].exchange).call({from: coinInfo[pair].exchange}, (err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log(res)
          cb(null, balance)
        })
      },
      (balance, cb) => {
        web3.eth.getBalance(coinInfo[pair].exchange).then(res => {
          // console.log(res)
          cb(null, {
            fsn: res,
            token: balance
          })
        })
      },
      (obj, cb) => {
        let x = Number($$.fromWei(obj.fsn))
        let y = Number($$.fromWei(obj.token, coinInfo[pair].dec))
        let data = {
          ticker_id: pair + '_FSN',
          timestamp: parseInt(Date.now() / 1000).toString(),
          bids: [
            calculateBuy(x, y, depth / 2),
            calculateBuy(x, y, depth)
          ],
          asks: [
            calculateSell(x, y, depth / 2),
            calculateSell(x, y, depth)
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
  let pairs = params.market_pair.split('_')[0]
  if (params.market_pair && coinInfo[pairs]) {
    getAmount(params.depth, pairs).then(res => {
      let data = {
        timestamp: Number(res.timestamp) * 1000 + '',
        bids: res.bids,
        asks: res.asks
      }
      response.send(data)
    })
  } else if (params.market_pair && !coinInfo[pairs]) {
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
  let pairs = params.ticker_id.split('_')[0]
  if (params.ticker_id && coinInfo[pairs]) {
    getAmount(params.depth, pairs).then(res => {
      response.send(res)
    })
  } else if (params.ticker_id && !coinInfo[pairs]) {
    response.send({})
  } else {
    response.send({})
  }
})

module.exports = router