const express = require('express');
const {createUser, GenerateOTP, userAccountData , verifyOTP, disableOtp, getUserBalance} = require('../controller/userCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware')
const router = express.Router();
const validateOtp = require('../middlewares/validateOtp');


router.post('/create', createUser);
router.post("/otp/generate", verifyJwt , GenerateOTP);
router.post("/otp/verify", verifyJwt , verifyOTP);
router.post("/otp/disable", verifyJwt , validateOtp, disableOtp);
router.post('/account', verifyJwt , userAccountData )
router.post('/balance', verifyJwt , getUserBalance )


module.exports = router