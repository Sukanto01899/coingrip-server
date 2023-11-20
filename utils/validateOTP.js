var speakeasy = require("speakeasy");

const validateOTP = (base32, token)=>{
    if(!base32 || !token) return false;
    var tokenValidates = speakeasy.totp.verify({
        secret: base32,
        encoding: 'base32',
        token: token.trim(),
        window: 6
      });

      return tokenValidates;
}

module.exports = validateOTP;