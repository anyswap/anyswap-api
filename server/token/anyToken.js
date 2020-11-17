const express = require('express'); //1
const router = express(); //2

router.get('/tokenList', (request, response) => {
  console.log('Request:')
  response.send(
    {
      keywords: ["defi"],
      logoURI: "https://umaproject.org/assets/images/UMA_square_red_logo_circle.png",
      name: "FSN",
      timestamp: "2020-08-25T01:40:34.305Z",
      tokens: [
        {
          address: "0x4E2F3b7ED3E4247cfdE11F3721C8eA30A65B935b",
          chainId: 4,
          decimals: 18,
          name: "DAI",
          symbol: "DAI"
        },
        {
          address: "0xB9664E57EC97cA273a031dAdc56b6c553E7F1894",
          chainId: 4,
          decimals: 18,
          name: "SUSD",
          symbol: "SUSD"
        },
        {
          address: "0x2f674F271F101B60831ad462fc13Fb634136c799",
          chainId: 4,
          decimals: 18,
          name: "aETH",
          symbol: "aETH"
        },
        {
          address: "0x48D807665278B5DF792538Aa6BE5Db71791933dD",
          chainId: 4,
          decimals: 18,
          name: "aBTC",
          symbol: "aBTC"
        }
      ],
      version: {major: 1, minor: 0, patch: 0}
    }
  )
})

module.exports = router