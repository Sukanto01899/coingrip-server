const axios = require('axios');


const coinPrice = axios.create({
    baseURL: 'https://api.livecoinwatch.com',
    timeout: 3000,
    headers: {
        'x-api-key': 'c6ff5376-09fb-45f7-9eea-f65bf6792882',
    }
})

module.exports = {coinPrice}