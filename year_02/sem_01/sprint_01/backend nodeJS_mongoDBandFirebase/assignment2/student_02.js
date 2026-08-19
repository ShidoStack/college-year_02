const http = require("http");

const server = http.createServer((req, res) => {

    res.writeHead(200, { "Content-Type": "text/html" });

    res.write(`
        <html>
        <head>
            <title>Student Portal</title>
        </head>

        <body>
            <h1>Student Portal</h1>

            <p>Name: Laxman Joshi</p>
            <p>Course: Full Stack Development</p>
            <p>College: ITM Skills University</p>

            <p>Welcome to my node-js based simple application.</p>
        </body>
        </html>
    `);

    res.end();
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});