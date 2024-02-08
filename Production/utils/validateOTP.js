var speakeasy = require("speakeasy");

const validateOTP = (base32, token)=>{
  // console.log(base32, token)
    if(!base32 || !token) return false;
    var tokenValidates = speakeasy.totp.verify({
        secret: base32,
        encoding: 'base32',
        token: token,
        window: 6
      });

      // console.log({token: tokenValidates})

      return tokenValidates;
}

module.exports = validateOTP;