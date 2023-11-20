const express = require('express');
const {sendAsset, getAllTransaction} =require('../controller/transactionCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware');
const validateSender = require('../middlewares/validateSender');
const router = express.Router();


router.post('/send',verifyJwt, validateSender, sendAsset);
router.get('/',verifyJwt, getAllTransaction);

module.exports = router;