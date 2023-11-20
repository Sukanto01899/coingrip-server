const validateSender = (req, res, next)=>{
    const {isBlocked } = req?.user;

    if(isBlocked){
        next({message: 'You are blocked'});
        return
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