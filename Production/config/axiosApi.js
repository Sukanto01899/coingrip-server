const axios = require('axios');
const retryAxios = require('../utils/retryAxios')


const coinPrice = axios.create({
    baseURL: 'https://api.livecoinwatch.com',
    timeout: 5000,
    headers: {
        'x-api-key': 'c6ff5376-09fb-45f7-9eea-f65bf6792882',
    }
})

retryAxios(coinPrice, {retryTime: 3})


module.exports = {coinPrice}