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

// function calculateEtherTokenOutputFromInput(inputAmount, inputReserve, outputReserve) {
//   inputReserve = ethers.utils.bigNumberify(inputReserve)
//   outputReserve = ethers.utils.bigNumberify(outputReserve)
//   const inputAmountWithFee = inputAmount.mul(ethers.utils.bigNumberify(997))
//   const numerator = inputAmountWithFee.mul(outputReserve)
//   const denominator = inputReserve.mul(ethers.utils.bigNumberify(1000)).add(inputAmountWithFee)
//   return numerator.div(denominator)
// }



// let contract = new web3.eth.Contract(ERC20, coinInfo['ANY'].token)
// contract.methods.balanceOf(coinInfo['ANY'].exchange).call({from: coinInfo['ANY'].exchange}, (err, res) => {
//   let balance = 0
//   if (!err) {
//     balance = res
//   }
//   console.log(res)
// })
// web3.eth.getBalance(coinInfo['ANY'].exchange).then(res => {
//   console.log(res)
// })

function getAmount (depth, pair, pecent = 200) {
  let data = {
    bids: [],
    asks: []
  }
  depth = depth.toString()
  depth = ethers.utils.parseUnits(depth, coinInfo[pair].dec)
  depth = depth.mul(999).div(1000)
  return new Promise(resolve => {
    let exchangeContract = new web3.eth.Contract(EXCHANGE, coinInfo[pair].exchange)
    async.waterfall([
      (cb) => {
        exchangeContract.methods.getEthToTokenInputPrice(depth).call((err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log('max')
          // console.log(balance)
          cb(null, balance)
        })
      },
      (max, cb) => {
        exchangeContract.methods.getEthToTokenInputPrice(depth.mul(10000 - pecent).div(10000)).call((err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log('min')
          // console.log(balance)
          data.bids = [
            [
              (Number(depth.toString()) / Number(max.toString())).toFixed(5)
              , $$.fromWei(max, coinInfo[pair].dec)
            ],
            [
              (Number(depth.toString()) / Number(balance.toString())).toFixed(5)
              , $$.fromWei(balance, coinInfo[pair].dec)
            ],
          ]
          cb(null, data)
        })
      },
      (results, cb) => {
        exchangeContract.methods.getTokenToEthInputPrice(depth).call((err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log('max')
          // console.log(balance)
          cb(null, balance)
        })
      },
      (max, cb) => {
        exchangeContract.methods.getTokenToEthInputPrice(depth.mul(10000 - pecent).div(10000)).call((err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          // console.log('min')
          // console.log(balance)
          data.asks = [
            [
              (Number(depth.toString()) / Number(max.toString())).toFixed(5)
              , $$.fromWei(max, coinInfo[pair].dec)
            ],
            [
              (Number(depth.toString()) / Number(balance.toString())).toFixed(5)
              , $$.fromWei(balance, coinInfo[pair].dec)
            ],
          ]
          cb(null, data)
        })
      }
    ], (err, res) => {
      resolve(data)
    })
  })
}

router.get('/orderbook', (request, response) => {
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
  }
})

module.exports = router