const pathLink = require('path').resolve('.')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('historical')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const {TxnsCharts} = require(pathLink + '/server/public/db/summaryDB')

router.get('/trades/:market_pair', (request, response) => {
  let params = request.params
  // console.log(params)
  // response.send(request.query)
  if (!params.market_pair || (params.market_pair && params.market_pair.indexOf('_') === -1)) {
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
  const IS_USDT = params.market_pair.indexOf('USDT') !== -1
  let pairObj = $$.getPair(params.market_pair)
  let pairs = pairObj.pair
  let chainID = $$.nameToChainID(pairObj.base)
  let limit = 100

  let query = {}
  let data = []
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
  } else {
    query.timestamp = {
      $lte: (Date.now() / 1000) - (60 * 60 * 24)
    }
  }
  let queryObj = [
    {$sort: {timestamp: -1, index: -1}},
    {$match: {
      ...query,
      pairs,
      chainID
    }}
  ]
  if (limit) {
    queryObj.push({$limit: limit})
  }
  TxnsCharts.aggregate(queryObj).limit(10).exec((err, res) => {
    if (!err && res.length > 0) {
      // logger.info(res)
      for (let obj of res) {
        data.push({
          trade_id: obj.hash,
          price: (IS_USDT ? $$.formatNumTodec(1 / obj.market) : $$.formatNumTodec(obj.market)).toString(),
          base_volume: (IS_USDT ? obj.fv : obj.tv).toString(),
          quote_volume: (IS_USDT ? obj.tv : obj.fv).toString(),
          timestamp: Number(obj.timestamp) * 1000 + '',
          type: obj.type === 'EthPurchase' ? 'sell' : 'buy',
        })
      }
    }
    response.send(data)
  })
})

router.get('/api/historical_trades', (request, response) => {
  let params = request.query
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
  const IS_USDT = params.ticker_id.indexOf('USDT') !== -1
  // let pairs = IS_USDT ? params.ticker_id.split('_')[1] : params.ticker_id.split('_')[0]
  let pairObj = $$.getPair(params.ticker_id)
  let pairs = pairObj.pair
  let chainID = $$.nameToChainID(pairObj.base)
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
          {$sort: {timestamp: -1, index: -1}},
          {$match: {
            ...query,
            pairs,
            chainID,
            type: 'EthPurchase'
          }},
          {$project: {
            _id: null,
            trade_id: '$hash',
            price: '$market',
            base_volume: '$tv',
            target_volume: '$fv',
            trade_timestamp: '$timestamp',
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
            data.sell = []
            for (let obj of res) {
              // delete obj._id
              data.sell.push({
                trade_id: obj.trade_id,
                price: (IS_USDT ? $$.formatNumTodec(1 / obj.price) : $$.formatNumTodec(obj.price)).toString(),
                base_volume: (IS_USDT ? obj.target_volume : obj.base_volume).toString(),
                target_volume: (IS_USDT ? obj.base_volume : obj.target_volume).toString(),
                trade_timestamp: obj.trade_timestamp.toString(),
                type: obj.type,
              })
            }
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
          {$sort: {timestamp: -1,index: -1}},
          {$match: {
            ...query,
            pairs,
            chainID,
            type: 'TokenPurchase'
          }},
          {$project: {
            _id: null,
            trade_id: '$hash',
            price: '$market',
            base_volume: '$tv',
            target_volume: '$fv',
            trade_timestamp: '$timestamp',
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
            data.buy = []
            for (let obj of res) {
              // delete obj._id
              // data.buy.push(obj)
              data.sell.push({
                trade_id: obj.trade_id,
                price: (IS_USDT ? $$.formatNumTodec(1 / obj.price) : $$.formatNumTodec(obj.price)).toString(),
                base_volume: (IS_USDT ? obj.target_volume : obj.base_volume).toString(),
                target_volume: (IS_USDT ? obj.base_volume : obj.target_volume).toString(),
                trade_timestamp: obj.trade_timestamp.toString(),
                type: obj.type,
              })
            }
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