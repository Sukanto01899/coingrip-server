
const retryAxios = (axios, options)=>{
    const max_time = options.retryTime;
    let counter = 0;

    axios.interceptors.response.use(null, (error)=>{
        const config = error.config;
        if(counter < max_time){
            counter ++;
            return new Promise((resolve)=>{
                resolve(axios(config))
            })
        }

        return Promise.reject(error)
    })
}

module.exports = retryAxios;