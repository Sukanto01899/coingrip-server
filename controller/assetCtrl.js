const {coinPrice} = require('../config/axiosApi');
const Asset = require('../model/assetModel');
const cron = require('node-cron');
const validateMongoDBId = require('../utils/validMongodbId');
const User = require('../model/userModel');

// get asset price from coingecko api
const getAssetPrice =async (symbol, currency)=>{
    try{
        const data = await coinPrice.post(`/coins/single`, {currency, code: symbol, meta: true});
        console.log(data.data)
        return data.data;
    }catch(err){
        console.log(err)
    }
}

// Update all asset after 1 min
const updateAssetAuto = async()=>{
    try{
        const findAll = await Asset.find({});
        findAll.forEach(async (asset) =>{
           try{
            const price = await getAssetPrice(asset.symbol, 'USD');
            const updateAll = await Asset.findByIdAndUpdate({_id: asset._id}, {usdPrice: price?.rate});
           }catch(err){
            console.log(err)
           }
        })
    }catch(err){
        console.log(err)
    }
}

cron.schedule('*/1 * * * *', () => {
    console.log('updated')
    updateAssetAuto()
  });

// creating a asset
const createAsset =async (req, res, next)=>{
    let {name, symbol, totalReserved} = req.body;
   try{
    symbol = typeof(symbol) === 'string' && symbol.trim();
    name = typeof(name) === 'string' && name.trim();
    totalReserved = typeof(totalReserved) === 'number' && totalReserved;
    const price = await getAssetPrice(symbol, 'USD');
    console.log(price.rate)
    const asset = {
        name: name,
        symbol: symbol,
        totalReserved: totalReserved,
        usdPrice: price?.rate,
        logo: price?.webp64,
        color: price?.color
    }

    const findAsset =await Asset.findOne({symbol: symbol});
    if(!findAsset){
        const newAsset = await Asset.create(asset);
        res.json(newAsset)
    }else{
        const error = new Error('Asset already available')
        next(error)
    }
    
   }catch(err){
    const error = new Error(err)
    next(error)
   }
}

// Get all assets
const getAllAssets = async (req, res)=>{
    try{
        const assets = await Asset.find({});
        res.status(200).json(assets)
    }catch(err){

    }
}


/*

{
    "assetId": "655b757d9ec85d5dd84cc878"
}

*/

module.exports = {getAssetPrice, createAsset, getAllAssets}