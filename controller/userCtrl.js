const User = require('../model/userModel');
const generateToken = require('../config/generateToken');
var speakeasy = require("speakeasy");
const validateOTP = require('../utils/validateOTP');
const Asset = require('../model/assetModel')


const createUser = async (req, res, next)=>{
    const username = req?.body?.username;
    const email = req?.body?.email;
    const emailVerified = req?.body?.emailVerified;
   try{
    const findUser = await User.findOne(email ? {email} : {username});
    console.log(email, username)
    console.log(findUser)
    if(!findUser){
        const userData = {
            name: req?.body?.name,
            username: username,
            email: email,
            emailVerified: emailVerified
        }
        const newUser = await User.create(userData);
        
        res.status(200).json({token: generateToken({user: newUser?.email || newUser?.username})})
    }else{
        if(username || email){
            res.json({token: generateToken({user: findUser?.email || findUser?.username})})
        }else{
            throw new Error('Input data not found')
        }
    }
   }catch(err){
    console.log(err)
    const error =  new Error(err);
    next(error)
   }
}

const updateUser = async (req, res)=>{};

const deleteUser = async (req, res)=>{}

const getUserBalance = async (req, res, next)=>{
    const {balance, _id} = req?.user;

    try{
        const user_assets = balance?.assets;
        const all_assets =await Asset.find({});

        // If user have asset then count total value of asset in usd
        if(user_assets.length > 0){
            let total = 0;
            all_assets.forEach(all => {
                user_assets.forEach(user => {
                    const match = user.assetId.toString() === all._id.toString();
                    if(match){
                        const value = all.usdPrice * user.amount;
                        total +=value;
                    }
                })
            })

            const update = await User.findOneAndUpdate({_id: _id}, {"balance.total_value": total});
            res.send({assets: update?.balance?.assets, totalValue:  update.balance.total_value})
        }else{
            res.send({assets: null, totalValue: 0})
        }
    }catch(err){
        console.log(err);
        next(err)
    }
}

const userAccountData = async (req, res)=>{
    const {name, email, username, isBlocked, role, auth, balance, _id} = req?.user;
    const id = req.params.id;

    try{
        const user_assets = balance?.assets;
        const all_assets =await Asset.find({});

        // If user have asset then count total value of asset in usd
        if(user_assets.length > 0){
            let total = 0;
            all_assets.forEach(all => {
                user_assets.forEach(user => {
                    const match = user.assetId.toString() === all._id.toString();
                    if(match){
                        const value = all.usdPrice * user.amount;
                        total +=value;
                    }
                })
            })

            const update = await User.updateOne({_id: _id}, {"balance.total_value": total})
        }
        res.send({name, email, username, isBlocked, role, auth, balance, _id})
    }catch(err){
        console.log(err)
    }
}

const GenerateOTP =async (req, res, next)=>{
    
    try{
        const {username, email, auth} = req.user;

        if(auth.otp_enabled){
            throw new Error('Authentication already enabled')
        }

        const secret = speakeasy.generateSecret({length: 20});

        const updateAuthData = await User.findOneAndUpdate(
            {$or: [{username}, {email}]}, {authData: {...secret}});
           
        res.status(200).json(
            {authData: {
                base32: secret.base32, 
                otpauth_url: secret.otpauth_url
            }});
    }catch(err){
        const error = new Error(err.message);
        next(error)
    }
}

const verifyOTP =async (req, res, next)=>{
    try{
        // Get data from user req
        const {email, username,  authData, auth} = req?.user;
        const {code} = req?.body;
        
        // validate otp
        const otp_validation = validateOTP(authData?.base32, code);

        // If otp wrong give error
        if(!otp_validation){
            throw new Error('Authentication failed. Please try again.')
        }

         // if otp not enabled then update otp enabled
        if(!auth?.otp_enabled){
         const updateUser = await User.findOneAndUpdate({$or: [{email}, {username}]}, {auth: {otp_enabled: otp_validation, otp_verified: otp_validation}});
        }

        // send response
        res.status(200).json({
            otp_verified: otp_validation
        })
    }catch(err){
        next(err)
    }
}

const disableOtp = async(req, res, next)=>{
    const {_id} = req.user;
    try{
        const updateUser = await User.findOneAndUpdate({_id: _id}, {auth: {otp_enabled: false, otp_verified: false}});
        console.log(updateUser)
        res.status(200).json({isDisabled: true})
    }catch(err){
        next(err)
    }
}

module.exports = {createUser, updateUser, deleteUser, GenerateOTP, userAccountData, verifyOTP, disableOtp, getUserBalance}