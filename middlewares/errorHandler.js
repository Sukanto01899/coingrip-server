// Not Found 
const notFound = (req, res, next)=>{
    const error = new Error(`Not found:  ${req.originalUrl}`);
    res.status(404);
    next(error)
}

// Error Handler
const errorHandler = (err, req, res, next)=>{
    console.log('okk', err)
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log(statuscode)
    res.status(statuscode);
    res.json({
        status: 'Request failed',
        message: err?.message,
        stack: err.stack
    })
}

module.exports = {notFound, errorHandler}