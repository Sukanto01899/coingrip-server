const { default: mongoose } = require("mongoose")

const dbConnect = ()=>{
    try{
        const con = mongoose.connect(process.env.MONGODB_URL);
        console.log('Database successfully connected')
    }catch(err){
        console.log('Database error', err)
    }
}

module.exports = dbConnect;