const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/student') {

        const student = {
            id: 101,
            name: 'Laxman',
            course: 'BTECH CSE',
            semester: 3,
            city: 'Navi - Mumbai'
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(student));

    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

