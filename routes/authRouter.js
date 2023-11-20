const express = require('express');
const {createUser, GenerateOTP, userAccountData , verifyOTP} = require('../controller/userCtrl');
const {verifyJwt} = require('../middlewares/authMiddleware')
const router = express.Router();


router.post('/create', createUser);
router.post("/otp/generate", verifyJwt , GenerateOTP);
router.post("/otp/verify", verifyJwt , verifyOTP);
router.post('/account', verifyJwt , userAccountData )


module.exports = router