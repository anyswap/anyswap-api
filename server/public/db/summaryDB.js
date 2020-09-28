const pathLink = require('path').resolve('.')
const mongoose = require( 'mongoose' )
const Schema   = mongoose.Schema
const config = require(pathLink + '/config')
const nodeDB = require(pathLink + '/config/private')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('summaryDB')


const TxnsCharts = new Schema({
  keyId: {type: String, unique: true},
  market: {type: Number},
  fv: {type: Number}, // fsn volume
  tv: {type: Number}, // token volume
  timestamp: {type: Number},
  hash: {type: String},
  pairs: {type: String},
  type: {type: String},
  index: {type: Number},
  chainID: {type: Number},
}, {collection: 'TxnsCharts'})

const TradeInfos = new Schema({
  token: {type: String, unique: true},
  exchange: {type: String},
  symbol: {type: String},
  name: {type: String},
  decimals: {type: Number},
  timestamp: {type: Number},
  chainID:  {type: Number},
  isSwitch: {type: Number, default: 0}
}, {collection: 'TradeInfos'})


TxnsCharts.index({timestamp: -1, index: -1}, {background: 1})
TradeInfos.index({timestamp: -1}, {background: 1})

const OPTIONS = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}
let SummaryDB = mongoose.createConnection(nodeDB['SUMMARY'].mongoDBurl, OPTIONS)
/**
  * 连接成功
  */
SummaryDB.on('connected', () => {
  logger.info("db.js")
  logger.info('Mongoose connection success: ' + nodeDB['SUMMARY'].mongoDBurl)
})
/**
 * 连接异常
 */
SummaryDB.on('error', err => {
  logger.error('Mongoose connection error: ' + err.toString())
})
/**
 * 连接断开
 */
SummaryDB.on('disconnected', () => {
  logger.info('Mongoose connection disconnected')
})
module.exports = {
  TxnsCharts: SummaryDB.model('TxnsCharts', TxnsCharts),
  TradeInfos: SummaryDB.model('TradeInfos', TradeInfos)
}
