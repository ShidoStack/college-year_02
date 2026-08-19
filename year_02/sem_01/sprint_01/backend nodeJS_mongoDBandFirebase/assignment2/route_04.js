const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.end('Welcome to Home Page.. this is the main or first page');

    } else if (req.url === '/about') {
        res.end('About Us..');

    } else if (req.url === '/contact') {
        res.end('Contact Information.. contact at 9844601432 ');

    } else if (req.url === '/services') {
        res.end('Our Services - as u request so we provide');

    } else {
        res.writeHead(404);
        res.end('404 - Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});