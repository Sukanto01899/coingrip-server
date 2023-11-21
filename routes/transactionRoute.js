const express = require('express');
const {sendAsset, getAllTransaction, demoAssetRequest} =require('../controller/transactionCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware');
const validateSender = require('../middlewares/validateSender');
const router = express.Router();


router.post('/send',verifyJwt, validateSender, sendAsset);
router.get('/',verifyJwt, getAllTransaction);
router.get('/demo/:assetId', verifyJwt, demoAssetRequest);

module.exports = router;