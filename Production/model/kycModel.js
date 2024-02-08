const mongoose = require('mongoose');

const kycModel = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    country: {
        type: String,
        required: true
    },
    nid_number: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
    },
    nid_image: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Kyc', kycModel);