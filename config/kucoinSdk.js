const API = require('kucoin-node-sdk');

const config = {
    baseUrl: 'https://api.kucoin.com',
    apiAuth: {
      key: process.env.KUCOIN_KEY, // KC-API-KEY
      secret: process.env.KUCOIN_SECRET, // API-Secret
      passphrase: process.env.KUCOIN_PASS, // KC-API-PASSPHRASE
    },
    authVersion: 2, // KC-API-KEY-VERSION. Notice: for v2 API-KEY, not required for v1 version.
  }

API.init(config);

module.exports = API;