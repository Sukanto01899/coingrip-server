const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
    color: {
        type: String
    },
    totalReserved: {
        type: Number,
        default: 0
    },
    usdPrice: {
        type: Number
    },
    exchangeable: {
        type: Boolean,
        default: true
    },
    transferable: {
        type: Boolean,
        default: true
    },
    fee: {
        type: Number,
        default: 3
    },
    minWithdraw: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('Asset', assetSchema);