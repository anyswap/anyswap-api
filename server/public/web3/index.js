const pathLink = require("path").resolve(".")
// const pathLink = path

const Web3 = require('web3')
// import config from '@/config'
// console.log(pathLink)
const config = require(pathLink + '/config/index.js')
// console.log(config)
let web3
// let currentProvider = ''
// console.log(config)
// console.log(config.nodeRpc)
let currentProvider = new Web3.providers.HttpProvider(config.nodeRpc)
try {
  web3 = new Web3(currentProvider)
} catch (error) {
  web3 = new Web3()
}

// web3.extend({
//   property: 'fsn',
//   methods: [
//     {
//       name: 'getTimeLockBalance',
//       call: 'fsn_getTimeLockBalance',
//       params: 1,
//       inputFormatter: [null],
//       outputFormatter: null
//     }
//   ]
// })


// export default web3
module.exports = web3