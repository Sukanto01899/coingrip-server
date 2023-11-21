const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const verifyJwt =async (req, res, next)=>{
    const auth = req?.headers?.authorization;
    console.log(auth)
       try{

         if(!auth || !auth.startsWith('Bearer')){
            console.log('error')
            throw new Error('There is no token attached to header.');
        }
          const token = auth.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const findUser = await User.findOne({$or: [{username: decoded?.user}, {email: decoded?.user}]});
          req.user = findUser;
          next()
        }catch(err){
           const error = new Error('Not authorized token expired, Please login again');
         //   console.log('here',err)
           next(error)
        }
}



module.exports = {verifyJwt}