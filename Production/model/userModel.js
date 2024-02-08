const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    username: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    emailVerified: {
        type: Boolean
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    socialId: {
        facebook: String,
        twitter: String,
        github: String
    },
    auth: {
        otp_enabled: {
            type: Boolean,
            default: false
        },
        otp_verified: {
            type: Boolean,
            default: false
        },
        kyc_verified: {
            type: Boolean,
            default: false
        },
        ip_address: [{device: String, ip: String}],
        send_limit: {
            daily_limit: {
                type: Number,
                default: 10000
            },
            current_limit: {
                type: Number,
                default: 0
            },
            last_updated: {
                type: Date,
                default: Date.now()
            }
        }
    },
    authData: {
        type: Object
    },
    balance: {
        total_value: {
            type: Number,
            default: 0
        },
        point: {
            type: Number,
            default: 0
        },
        assets: [
            {
                assetId: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Asset'
                },
                amount: {
                    type: Number,
                    default: 0
                },
                symbol: String
            }
        ]
    },
    referrals: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        isSuccess: {
            type: Boolean,
            default: false
        }
    }],
    inviter: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    }

}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)