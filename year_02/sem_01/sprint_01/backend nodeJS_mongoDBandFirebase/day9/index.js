const http = require('http')
const fs = require('fs');

const server = http.createServer((req,res) => {
    if(req.url === '/home') res.end('this is home page.');
    else if(req.url === '/blog') res.end('this is blog page');
    else if(req.url === '/contact') res.end('this is contact page........');
    else if (req.url === '/data') {
        const data = fs.readFileSync('data.json', 'utf-8')
        res.end(data)
    } 
    else  res.end('404 page not found');

})

server.listen(8000, () => {
    console.log('Server is running on port 8000')
})