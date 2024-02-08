const express = require('express');
const {createUser, GenerateOTP, userAccountData , verifyOTP, disableOtp, getUserBalance, verifyCaptcha, getReferralDetails, submitKycRequest, getKycDetails} = require('../controller/userCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware')
const router = express.Router();
const validateOtp = require('../middlewares/validateOtp');


router.post('/create', createUser);
router.post('/captcha/verify', verifyCaptcha);
router.post("/otp/generate", verifyJwt , GenerateOTP);
router.post("/otp/verify", verifyJwt , verifyOTP);
router.post("/otp/disable", verifyJwt , validateOtp, disableOtp);
router.post('/account', verifyJwt , userAccountData );
router.post('/balance', verifyJwt , getUserBalance )
router.post('/referrals', verifyJwt, getReferralDetails );
router.post('/kyc/submit', verifyJwt, submitKycRequest);
router.get('/kyc/:id', verifyJwt, getKycDetails );


module.exports = router