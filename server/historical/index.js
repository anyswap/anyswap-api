const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('historical')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const mongoose = require('mongoose')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const TxnsCharts = mongoose.model('TxnsCharts')

router.get('/historical_trades', (request, response) => {
  // logger.info('request.query')
  // logger.info(request.query)
  let params = request.query
  // response.send(request.query)
  if (!params.ticker_id || (params.ticker_id && params.ticker_id.indexOf('_') === -1)) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  if ((params.start_time && isNaN(params.start_time)) || (params.end_time && isNaN(params.end_time))) {
    response.send({
      error: 'Time is error!'
    })
    return
  }
  let pairs = params.ticker_id.split('_')[0]
  let limit = 100
  let type = params.type ? params.type : ''
  let query = {}
  let data = {}
  if (params.limit) {
    limit = parseInt(params.limit)
  } else if (parseInt(params.limit) === 0) {
    limit = 0
  }
  if (params.start_time && params.end_time) {
    query.timestamp = {
      $gte: params.start_time,
      $lte: params.end_time
    }
  } else if (params.start_time && !params.end_time) {
    query.timestamp = {
      $gte: params.start_time
    }
  } else if (!params.start_time && params.end_time) {
    query.timestamp = {
      $lte: params.end_time
    }
  }
  async.waterfall([
    (cb) => {
      if (!type || type === 'sell') {
        let query_sell = [
          {$sort: {timestamp: -1}},
          {$match: {
            ...query,
            pairs,
            type: 'EthPurchase'
          }},
          {$project: {
            _id: null,
            trade_id: pairs + '_FSN',
            price: '$market',
            target_volume: '$fv',
            base_volume: '$tv',
            timestamp: '$timestamp',
            type: 'sell'
          }}
        ]
        if (limit) {
          query_sell.push({$limit: limit})
        }
        TxnsCharts.aggregate(query_sell).exec((err, res) => {
          if (err) {
            logger.error(err)
            data.sell = []
          } else {
            data.sell = res
          }
          cb(null, data)
        })
      } else {
        cb(null, '')
      }
    },
    (result, cb) => {
      if (!type || type === 'buy') {
        let query_buy = [
          {$sort: {timestamp: -1}},
          {$match: {
            ...query,
            pairs,
            type: 'TokenPurchase'
          }},
          {$project: {
            _id: null,
            trade_id: pairs + '_FSN',
            price: '$market',
            target_volume: '$fv',
            base_volume: '$tv',
            timestamp: '$timestamp',
            type: 'buy'
          }}
        ]
        if (limit) {
          query_buy.push({$limit: limit})
        }
        TxnsCharts.aggregate(query_buy).exec((err, res) => {
          if (err) {
            logger.error(err)
            data.buy = []
          } else {
            data.buy = res
          }
          cb(null, data)
        })
      } else {
        cb(null, '')
      }
    },
  ], () => {
    response.send(data)
  })
})

module.exports = router