const http = require('http')

const server = http.createServer((req,res)=>{
    if(req.url=='/home' && req.method=='GET'){
        res.end('this is home page .........')
    } else if(req.url =='/sendData' && req.method=='POST'){
        res.end('new Data send ho gaya ...')
        let str = "";
        req.on ('data',(chunk)=>{
            str += chunk
        })
        req.on('end',()=>{
            console.log(str)
        })
    }
})


server.listen(4040,()=>{
    console.log('server is running on port 4040')
})