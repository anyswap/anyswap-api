const pathLink = require("path").resolve(".")
const privateConfig = require('./private')

let publicSet = {
  ...privateConfig,
  nodeRpc: 'https://testnet.fsn.dev/api',
  intervalTime: 8 * 1000,
  apiPort: 8106
}
publicSet.nodeRpc = 'https://mainnet.anyswap.exchange'
module.exports = publicSet