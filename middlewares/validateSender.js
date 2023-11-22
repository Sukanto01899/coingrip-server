const validateSender = (req, res, next)=>{
    const { to, assetId, amount, pin}  = req?.body;
    const {isBlocked } = req?.user;

     // body data checking 
     if( !to || !assetId || !amount || !pin){
        const error =  new Error (`Invalid data input.`);
        return next(error);
    }
    let sendingAmount = parseFloat(amount);
    const receiverId = (typeof(to) === 'string') && to.trim();

    // Sending amount checking if bigger then 0
    if(sendingAmount <= 0){
        const error =  new Error (`Your balance is to low.`);
        return next(error);
    }

    if(isBlocked){
        const error =  new Error (`Your are blocked.`);
        return next(error);
    }
    // if(!auth.otp_enabled){
    //     next({message: 'Please set authentication before transaction'})
    //     return
    // }
    // if(auth?.send_limit?.daily_limit > auth?.send_limit?.current_limit){
    //         next({message: 'Your daily transaction limit exceeded'})
    // }
       

    next()
}

module.exports = validateSender;