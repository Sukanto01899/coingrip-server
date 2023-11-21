const express = require('express');
const dbConnect = require('./config/dbConnect');
const {notFound, errorHandler} = require('./middlewares/errorHandler')
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 4000 || process.env.PORT;
require('dotenv').config();
var cron = require('node-cron');
const {coinPrice} = require('./config/axiosApi')

// Require all route
const authRouter = require('./routes/authRouter');
const assetRoute = require('./routes/assetRoute');
const transactionRoute = require('./routes/transactionRoute')

// Database connection
dbConnect()
// Morgan
app.use(morgan('dev'))
app.use(cookieParser())
// Json parser
app.use(express.json())
// Cors
app.use(cors({origin: "https://money-send.netlify.app", credentials: true}))

// Routes
app.get('/', (req, res)=>{
  res.send("ok")
  })
app.use('/api/user', authRouter )
app.use('/api/asset', assetRoute)
app.use('/api/transaction', transactionRoute)

// Error handler middleware
app.use(notFound);
app.use(errorHandler);
// server run
app.listen(PORT, ()=>{
    console.log('Server running on port: ', PORT)
})