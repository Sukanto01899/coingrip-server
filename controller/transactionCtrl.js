const User = require('../model/userModel');
const Asset = require('../model/assetModel');
const Transaction = require('../model/transactionModel');
const validateMongoDBId = require('../utils/validMongodbId');
const mongoose = require('mongoose');
const sendEmail = require('../config/nodemailer');

// Update balance helper func, when need to update old balance
const updateBalance = async (updateData)=>{
    const {userId, assetId, symbol, amountToUpdate} = updateData;
    console.log({userId, assetId, symbol, amountToUpdate})
    
    try{
        // Find user
        const user = await User.findOne({_id: userId});
        // check receiver for previously balance have
        const previousBalance = user.balance.assets.find(asset => asset.assetId.toString() === assetId.toString());

        if(!previousBalance){
            const updateReceiverBalance =await User.updateOne({_id: userId}, {$push: {"balance.assets": {assetId: assetId, amount: amountToUpdate , symbol: symbol}}});
        }else{
            const oldAndNewTotalBalance = previousBalance.amount + amountToUpdate;
            const index = user.balance.assets.indexOf(previousBalance);
            previousBalance.amount = oldAndNewTotalBalance;
            user.balance.assets.set(index, previousBalance);
            user.save();
        }
    }catch(err){
        throw new Error(err)
    }
}

const sendAsset =async (req, res, next)=>{
    const { to, assetId, amount}  = req?.body;

    try{
        const receiverId = (typeof(to) === 'string') && to.trim();
        let sendingAmount = parseFloat(amount);
        const validAssetId = validateMongoDBId(assetId.trim()) && assetId.trim();

        // Changeable transaction status
        let transactionStatus;

        // Get sender user data from req
        const sender = req.user;
        
        // Find receiver by id, email or username
        const receiver = await User.findOne(validateMongoDBId(receiverId) ? {_id: receiverId} : {$or: [{email: receiverId}, {username: receiverId}]});

        // Find asset
        const asset = await Asset.findOne({_id: validAssetId});
        
        // Check receiver & asset is valid
        if(!receiver || !asset){
            throw new Error('Invalid address or asset.')
        }

        // Check receiver and sender address is same or not
        if(sender._id.toString() === receiver._id.toString()){
            throw new Error('You can not send asset to your own account')
        }
       
        // Find those asset from sender which will send to receiver
        const senderAsset = sender?.balance?.assets?.find(ast => ast.assetId.toString() === assetId);
        
        // Sender balance checking
        if(!senderAsset){
            throw new Error('You do not have enough balance 1')
        }

        // Transaction fee calculation
        const transactionFee = (sendingAmount * asset.fee) / 100;
        const amountWithTransactionFee = transactionFee + sendingAmount;
        const senderTotalAssetAmount = senderAsset.amount;

        // Again check total balance
        if(senderTotalAssetAmount < amountWithTransactionFee){
             throw new Error('You do not have enough balance')
        }

        // Cut balance and calculate new balance for sender
        const senderNewBalance = senderTotalAssetAmount - amountWithTransactionFee;
        
        // Update sender balance
        await updateBalance({
            userId: sender._id,
            assetId: asset._id,
            symbol: asset.symbol,
            amountToUpdate: senderNewBalance - senderTotalAssetAmount
        })

        // Update receiver balance____________
        await updateBalance({
            userId: receiver._id,
            assetId: asset._id,
            symbol: asset.symbol,
            amountToUpdate: sendingAmount
        })

        // Send transaction fee in to admin
        // Will bet set in later---------------------------------------------

        // Create new transaction data
        const transaction = {
            isSuccess: true,
            from: {
                name: sender.name,
                fromId: sender.email || sender.username,
                uuid: sender._id
            },
            to: {
                name: receiver.name,
                toId: receiver.email || receiver.username,
                uuid: receiver._id
            },
            amount: sendingAmount.toString(),
            transactionFee: transactionFee,
            asset: asset.name,
            assetId: asset._id,
            transactionType: 'transfer'
        }

        // Save transaction on database
        const createTransaction = await Transaction.create({...transaction});

        // Check transaction is success
        if(!createTransaction){
            throw new Error('Transaction creating failed')
        }

        // Send Transfer success email--
        if(sender.email){
            sendEmail({
                to: sender.email,
                subject: '[CoinGrip]Transfer Success',
                template: 'send',
                replace: {
                    username: sender.name,
                    amount: sendingAmount,
                    receiver: receiverId,
                    asset: asset.symbol,
                    txid: createTransaction._id
                }
            })
        }

        // Send Payment received email--
        if(receiver.email){
            sendEmail({
                to: receiver.email,
                subject: '[CoinGrip]Received Successfully',
                template: 'receive',
                replace: {
                    username: receiver.name,
                    amount: sendingAmount,
                    sender: sender.email || sender.username,
                    asset: asset.symbol,
                    txid: createTransaction._id,
                    time: createTransaction.createdAt
                }
            })
        }

        // Send Success response
        res.status(200).json({
            isSuccess: true,
            transaction: createTransaction
        });

    }catch(err){
        console.log(err)
        next(err)
    }
}

const getAllTransaction = async (req, res, next)=>{
    try{
        const limit = parseInt(req.query.limit)
        const page = parseInt(req.query.page)
        const {_id} = req.user;
        const totalTransaction = await Transaction.countDocuments({$or: [{"from.uuid": new mongoose.Types.ObjectId(_id)}, {"to.uuid": new mongoose.Types.ObjectId(_id)}]}).count().exec();
        console.log(totalTransaction)
        const transactions = await Transaction.find({$or: [{"from.uuid": new mongoose.Types.ObjectId(_id)}, {"to.uuid": new mongoose.Types.ObjectId(_id)}]}).skip(limit * page).limit(limit).sort([['createdAt', -1]]);
        res.status(200).json({transactions, total: totalTransaction})
    }catch(err){
        next(err)
    }
}

// Request demo assets
const demoAssetRequest = async (req, res, next) =>{
    const { assetId }  = req?.params;
  
    try{
        // body data validation
        if( !assetId ){
            throw new Error (`Invalid data input.`)
        }
        const validAssetId = validateMongoDBId(assetId.trim()) && assetId.trim();

        // Get user data from req
        const user = req.user;

        // Find asset
        const asset = await Asset.findOne({_id: validAssetId});

        // Find those asset from sender which will send to user
        const userAsset = user?.balance?.assets?.find(ast => ast.assetId.toString() === assetId);

        // Update user balance____________
        if(!userAsset){
            // If user do not have any balance previously
            await User.updateOne({_id: user._id}, {$push: {"balance.assets": {assetId: asset._id, amount: 5, symbol: asset.symbol}}}); 

        }else{
             // If user have asset then do not send asset
            if(userAsset.amount >= 5){
                throw new Error("You have enough balance for testing.")
            }
             // If receiver have balance previously
            const userOldBalance = userAsset.amount;
            const userNewBalance = userOldBalance + 2;
            await updateBalance(user?._id, asset?._id, userNewBalance)
        }

        // Send Success response
        res.status(200).json({
            isSuccess: true
        });

    }catch(err){
        console.log(err);
        next(err)
    }
}

const exchangeAsset = async (req, res, next)=>{
    try{
        const {from, to} = req.query;
        const amountToExchange = req.body.amount;
        const {_id, balance} = req.user;
        const {amount, assetId, symbol} = req.fromAsset;

        // Find to asset
        const assetTo =await Asset.findOne({symbol: to});
        // Find exchange from assets
        const assetFrom = await Asset.findOne({symbol: from});

        // Update balance
        const willPayNewBalance = amount - parseFloat(amountToExchange);
    
        // Update  "from asset" balance
        await updateBalance({
            userId: _id, 
            assetId, 
            symbol: from,
            amountToUpdate: willPayNewBalance - amount
        });

        // Calculate hou much asset user will received;
        const totalExchangeAmountUsd = parseFloat(amountToExchange) * assetFrom.usdPrice;
        const willReceiveAmount = totalExchangeAmountUsd / assetTo.usdPrice;

        // Update "To asset" balance
        await updateBalance({
            userId: _id,
            assetId: assetTo._id,
            symbol: assetTo.symbol,
            amountToUpdate: willReceiveAmount
        })

        // Create new transaction data
        const transaction = {
            isSuccess: true,
            from: {
                name: assetFrom.name,
                fromId: assetFrom._id,
                uuid: _id
            },
            to: {
                name: assetTo.name,
                toId: assetTo._id,
                uuid: _id
            },
            amount: `${amountToExchange.toFixed(5) +" "+ from} to ${willReceiveAmount.toFixed(5) +" "+ to}`,
            transactionFee: 1,
            asset: assetFrom.name,
            assetId: assetFrom._id,
            transactionType: 'exchange'
        }

        // Save transaction on database
        const createTransaction = await Transaction.create({...transaction});


        res.status(200).json({
            isSuccess: true,
            transaction: createTransaction
        });
    }catch(err){
        console.log(err)
        next(err)
    }
}


module.exports = {sendAsset, getAllTransaction, demoAssetRequest, exchangeAsset};