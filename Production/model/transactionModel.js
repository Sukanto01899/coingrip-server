const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    isSuccess: Boolean,
    from: {
        name: {
            type: String,
            required: true
        },
        fromId: {
            type: String,
            required: true
        },
        uuid: {
            type: mongoose.Schema.ObjectId,
            required: true
        }
    },
    to: {
        name: {
        type: String,
        required: true
    },
    toId: {
        type: String,
        required: true
    },
    uuid: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
    },
    amount: {
        type: String,
        required: true
    },
    transactionFee: {
        type: Number,
        required: true
    },
    asset: {
        type: String,
        required: true
    },
    assetId: {
        type: mongoose.Schema.ObjectId,
         required: true
    },
    transactionType: {
        type: String,
        enum: ['exchange', 'transfer', 'deposit', 'withdraw']
    }

}, {timestamps: true})

module.exports = mongoose.model('Transaction', transactionSchema);