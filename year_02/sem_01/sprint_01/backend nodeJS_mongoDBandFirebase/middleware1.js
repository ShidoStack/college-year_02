const middleware=(req,res,next)=>{
    if(req.url == '/contact'){
        console.log('middleware run with contact only.....')
        next()
    }else{
        console.log('dont have access....')
    }

}

module.exports = middleware