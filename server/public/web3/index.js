const pathLink = require("path").resolve(".")
// const pathLink = path

const Web3 = require('web3')
// import config from '@/config'
// console.log(pathLink)
const config = require(pathLink + '/config/index.js')
console.log(config.nodeRpc)
let web3
let currentProvider = new Web3.providers.HttpProvider(config.nodeRpc)
try {
  web3 = new Web3(currentProvider)
} catch (error) {
  web3 = new Web3()
}

module.exports = web3