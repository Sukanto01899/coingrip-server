const express = require('express');
const {sendAsset, getAllTransaction, demoAssetRequest, exchangeAsset, generateCryptoAddress} =require('../controller/transactionCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware');
const validateSender = require('../middlewares/validateSender');
const validateExchanger = require('../middlewares/validateExchanger');
const validateOtp = require('../middlewares/validateOtp');
const router = express.Router();


router.post('/send',verifyJwt, validateSender, validateOtp, sendAsset);
router.post('/exchange',verifyJwt, validateExchanger, exchangeAsset);
router.get('/',verifyJwt, getAllTransaction);
router.get('/demo/:assetId', verifyJwt, demoAssetRequest);
router.get('/generate/:symbol', generateCryptoAddress)

module.exports = router;