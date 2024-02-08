const validateExchanger = (req, res, next)=>{
    const {from, to} = req.query;
    const amount = req?.body?.amount;
    const {balance} = req.user;

    // Checking user input
    if(!from || !to || !amount){
        const error = new Error('Invalid input');
        return next(error)
    }

    // Checking from and to asset is different
    if(from === to){
        const error = new Error('You can not exchange between two same asset');
        return next(error)
    }

    // Checking amount is bigger then 0
    if(parseFloat(amount) <= 0){
        const error = new Error('Amount is too low');
        return next(error)
    }

    // Check exchanger user asset and balance for exchange
    const userAsset = balance.assets.find(asset => asset.symbol === from);
    if(!userAsset || userAsset.amount < parseFloat(amount)){
        const error = new Error('You do not have enough balance');
        return next(error)
    }

    req.fromAsset = userAsset;

    next()
}

module.exports = validateExchanger;