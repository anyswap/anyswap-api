const pathLink = require('path').resolve('.')
const mongoose = require( 'mongoose' )
const Schema   = mongoose.Schema
const config = require(pathLink + '/config')
const nodeDB = require(pathLink + '/config/private')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('DB')

const SyncInfo = new Schema({
  number: {type: Number},
  hash: {type: String},
  timestamp: {type: Number}
}, {collection: "SyncInfo"})

const Transactions = new Schema({
  hash: {type: String},
  blockNumber: {type: Number},
  blockHash: {type: String},
  transactionIndex: {type: Number},
  from: {type: String},
  to: {type: String},
  value: {type: String},
  nonce: {type: Number},
  gasLimit: {type: Number},
  gasUsed: {type: Number},
  gasPrice: {type: String},
  status: {type: Number},
  timestamp: {type: Number},
  erc20Receipts: {type: Array},
  exchangeReceipts: {type: Array},
}, {collection: "Transactions"})

const Liquidity = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  coin: {type: String},
  token: {type: String},
  liquidity: {type: String},
  blockNumber: {type: Number},
  blockHash: {type: String},
  timestamp: {type: Number},
}, {collection: "Liquidity"})

const Volume = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  cvolume24h: {type: String},
  tvolume24h: {type: String},
  blockNumber: {type: Number},
  blockHash: {type: String},
  timestamp: {type: Number},
}, {collection: "Volume"})

const Accounts = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  account: {type: String},
}, {collection: "Accounts"})

const LiquidityBalances = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  account: {type: String},
  blockNumber: {type: Number},
  liquidity: {type: String},
}, {collection: "LiquidityBalances"})

const VolumeHistory = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  account: {type: String},
  CoinAmount: {type: String},
  TokenAmount: {type: String},
  blockNumber: {type: Number},
  timestamp: {type: Number},
  txHash: {type: String},
  logType: {type: String},
  logIndex: {type: Number},
}, {collection: "VolumeHistory"})

SyncInfo.index({number: -1}, {background: 1})
Transactions.index({timestamp: -1, transactionIndex: -1}, {background: 1})
Liquidity.index({timestamp: -1}, {background: 1})
Volume.index({timestamp: -1}, {background: 1})
LiquidityBalances.index({blockNumber: -1}, {background: 1})
VolumeHistory.index({timestamp: -1}, {background: 1})

let db = {}
const OPTIONS = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

for (let obj in nodeDB) {
  // console.log(obj)
  if (!nodeDB[obj].chainID) continue
  let key = nodeDB[obj].chainID
  db[key] = mongoose.createConnection(nodeDB[obj].mongoDBurl, OPTIONS)
  db[key].SyncInfo = db[key].model('SyncInfo', SyncInfo)
  db[key].Transactions = db[key].model('Transactions', Transactions)
  db[key].Liquidity = db[key].model('Liquidity', Liquidity)
  db[key].Volume = db[key].model('Volume', Volume)
  db[key].Accounts = db[key].model('Accounts', Accounts)
  db[key].LiquidityBalances = db[key].model('LiquidityBalances', LiquidityBalances)
  db[key].VolumeHistory = db[key].model('VolumeHistory', VolumeHistory)

  /**
    * 连接成功
    */
   db[key].on('connected', () => {
    logger.info("db.js")
    logger.info(key + ' Mongoose connection success: ' + nodeDB[obj].mongoDBurl)
  })
  /**
   * 连接异常
   */
  db[key].on('error', err => {
    logger.error(key + ' Mongoose connection error: ' + err.toString())
  })
  /**
   * 连接断开
   */
  db[key].on('disconnected', () => {
    logger.info(key + ' Mongoose connection disconnected')
  })
}

module.exports = db