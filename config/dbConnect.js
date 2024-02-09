const { default: mongoose } = require("mongoose")

const dbConnect =async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database successfully connected')
    }catch(err){
        console.log('Database error', err)
    }
}

module.exports = dbConnect;

/*

server{
    listen 80;
    server-name 13.235.67.123;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

*/