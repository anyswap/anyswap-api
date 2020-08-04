const pathLink = require('path').resolve('.')
const mongoose = require( 'mongoose' )
const Schema   = mongoose.Schema
const config = require(pathLink + '/config')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('DB')

const SyncInfo = new Schema({
  number: {type: Number},
  hash: {type: String},
  timestamp: {type: Number}
}, {collection: "SyncInfo"})

const Blocks = new Schema({
  number: {type: Number},
  hash: {type: String},
  parentHash: {type: String},
  nonce: {type: String},
  miner: {type: String},
  difficulty: {type: String},
  gasLimit: {type: Number},
  gasUsed: {type: Number},
  timestamp: {type: Number}
}, {collection: "Blocks"})

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

const TxnsCharts = new Schema({
  market: {type: Number},
  fv: {type: Number}, // fsn volume
  tv: {type: Number}, // token volume
  timestamp: {type: Number},
  hash: {type: String},
  pairs: {type: String},
  type: {type: String},
}, {collection: 'TxnsCharts'})

const LiquidRewardResult = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  start: {type: Number},
  end: {type: Number},
  rewardToken: {type: String},
  account: {type: String},
  reward: {type: String},
  liquidity: {type: String},
  height: {type: Number},
  rewardTx: {type: String},
}, {collection: 'LiquidRewardResult'})

const VolumeRewardResult = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  start: {type: Number},
  end: {type: Number},
  rewardToken: {type: String},
  account: {type: String},
  reward: {type: String},
  volume: {type: String},
  txcount: {type: Number},
  rewardTx: {type: String},
}, {collection: 'VolumeRewardResult'})

const AccountsReward = new Schema({
  exchange: {type: String},
  pairs: {type: String},
  start: {type: Number},
  end: {type: Number},
  rewardToken: {type: String},
  account: {type: String},
  vr: {type: Number},
  lr: {type: Number},
  volume: {type: Number},
  txcount: {type: Number},
  liquidity: {type: Number},
  height: {type: Number},
  vrTx: {type: String},
  lrTx: {type: String},
  timestamp: {type: Number},
}, {collection: 'AccountsReward'})

const AccountsInfo = new Schema({
  account: {type: String},
  lr: {type: Number}, // 流动性奖励
  ltn: {type: Number}, // 流动性交易次数
  liquidity: {type: Number}, // 流动性
  vr: {type: Number}, // 交易量奖励
  vtn: {type: Number}, // 交易数
  volume: {type: Number}, // 交易量
  ar: {type: Number}, // 总奖励
  timestamp: {type: Number}, // 
}, {collection: 'AccountsInfo'})

SyncInfo.index({number: -1}, {background: 1})
Blocks.index({number: -1}, {background: 1})
Transactions.index({timestamp: -1}, {background: 1})
Liquidity.index({timestamp: -1}, {background: 1})
Volume.index({timestamp: -1}, {background: 1})
LiquidityBalances.index({blockNumber: -1}, {background: 1})
VolumeHistory.index({timestamp: -1}, {background: 1})
TxnsCharts.index({timestamp: -1}, {background: 1})
LiquidRewardResult.index({end: -1}, {background: 1})
VolumeRewardResult.index({end: -1}, {background: 1})
AccountsReward.index({timestamp: -1}, {background: 1})
AccountsInfo.index({ar: -1}, {background: 1})

mongoose.model('SyncInfo', SyncInfo)
mongoose.model('Blocks', Blocks)
mongoose.model('Transactions', Transactions)
mongoose.model('Liquidity', Liquidity)
mongoose.model('Volume', Volume)
mongoose.model('Accounts', Accounts)
mongoose.model('LiquidityBalances', LiquidityBalances)
mongoose.model('VolumeHistory', VolumeHistory)
mongoose.model('TxnsCharts', TxnsCharts)
mongoose.model('LiquidRewardResult', LiquidRewardResult)
mongoose.model('VolumeRewardResult', VolumeRewardResult)
mongoose.model('AccountsReward', AccountsReward)
mongoose.model('AccountsInfo', AccountsInfo)

mongoose.Promise = global.Promise

mongoose.connect(config.mongoDBurl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

/**
  * 连接成功
  */
 mongoose.connection.on('connected', () => {
  logger.info("db.js")
  logger.info('Mongoose connection success: ' + config.mongoDBurl)
})
/**
 * 连接异常
 */
mongoose.connection.on('error', err => {
  logger.error('Mongoose connection error: ' + err.toString())
})
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection disconnected')
})

module.exports = {
  SyncInfo: mongoose.model('SyncInfo'),
  Blocks: mongoose.model('Blocks'),
  Transactions: mongoose.model('Transactions'),
  Liquidity:  mongoose.model('Liquidity'),
  Volume: mongoose.model('Volume'),
  Accounts: mongoose.model('Accounts'),
  LiquidityBalances: mongoose.model('LiquidityBalances'),
  VolumeHistory: mongoose.model('VolumeHistory'),
  TxnsCharts: mongoose.model('TxnsCharts'),
  LiquidRewardResult: mongoose.model('LiquidRewardResult'),
  VolumeRewardResult: mongoose.model('VolumeRewardResult'),
  AccountsReward: mongoose.model('AccountsReward'),
  AccountsInfo: mongoose.model('AccountsInfo'),
}
