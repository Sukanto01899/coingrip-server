const validateOTP = require('../utils/validateOTP');

const validateOtp = (req, res, next)=>{
    const {authData, auth} = req.user;
    const {pin} = req.body;
    if(!auth.otp_enabled){
        const error = new Error('Authentication not enabled');
        return next(error)
    }
    if(!pin || (pin.length > 6)){
        const error = new Error('Invalid authentication code');
        return next(error)
    }
    
    const otp_validation = validateOTP(authData?.base32, pin.trim());

    if(!otp_validation){
         const error = new Error('Invalid authentication code');
         return next(error)
    }

    next()
}

module.exports = validateOtp;