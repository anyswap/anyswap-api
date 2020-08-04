const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const mongoose = require('mongoose')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const TxnsCharts = mongoose.model('TxnsCharts')

router.get('/tickers', (request, response) => {
  const NOW_TIME = Date.now()
  const query24h = {timestamp: {$gte: ((NOW_TIME / 1000) - (60 * 60 * 24))}}
  // let params = request.query
  // response.send(request.query)
  // if (!params.ticker_id || (params.ticker_id && params.ticker_id.indexOf('_') === -1)) {
  //   response.send({
  //     error: 'Params is error!'
  //   })
  //   return
  // }
  // let query_sell = [
  //   {$sort: {timestamp: -1}},
  //   {$match: {
  //     ...query,
  //     pairs,
  //     type: 'EthPurchase'
  //   }},
  //   {$project: {
  //     _id: null,
  //     trade_id: pairs + '_FSN',
  //     price: '$market',
  //     target_volume: '$fv',
  //     base_volume: '$tv',
  //     timestamp: '$timestamp',
  //     type: 'sell'
  //   }}
  // ]
  TxnsCharts.aggregate([
    {$match: {
      // ...query24h,
    }},
    {$sort: {'timestamp': 1} },
    {$group: {
      _id: '$pairs',
      last_price: {$last: '$market'},
      target_volume: {$sum: '$fv'},
      base_volume: {$sum: '$tv'},
      bid: {$last: '$market'},
      ask: {$last: '$market'},
      high: {$max: '$market'},
      low: {$min: '$market'},
    }},
    {$project: {
      ticker_id: '$_id',
      base_currency: '$_id',
      target_currency: 'FSN',
      last_price: '$last_price',
      target_volume: '$target_volume',
      base_volume: '$base_volume',
      bid: '$bid',
      ask: '$ask',
      high: '$high',
      low: '$low',
    }},
    {$sort: {'timestamp': 1} },
  ]).exec((err, res) => {
    if (err) {
      logger.error(err)
      response.send([])
    } else {
      let arr = []
      for (let obj of res) {
        obj.ticker_id = obj.ticker_id + '_FSN'
        arr.push(obj)
      }
      response.send(arr)
    }
  })
})

module.exports = router