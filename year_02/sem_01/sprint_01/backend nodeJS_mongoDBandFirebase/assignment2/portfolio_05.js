const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <a href="/">Home</a>
            <a href="/about">About Me</a>
            <a href="/skills">Skills</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>

            <h1>Home</h1>
            <p>Welcome to my portfoli website.</p>
        `);

    } else if (req.url === "/about") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <a href="/">Home</a>
            <a href="/about">About Me</a>
            <a href="/skills">Skills</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>

            <h1>About Me</h1>
            <p>My name is Laxman Joshi.</p>
            <p>I am a BTECH CSE student.</p>

        `);

    } else if (req.url === "/skills") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <a href="/">Home</a>
            <a href="/about">About Me</a>
            <a href="/skills">Skills</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>

            <h1>Skills</h1>
            <p>Frontend Development</p>
            <p>C/C++ </p>
            <p>DSA</p>
            <p>Observation & Recognition</p>
            <p>Maths</p>

        `);

    } else if (req.url === "/projects") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <a href="/">Home</a>
            <a href="/about">About Me</a>
            <a href="/skills">Skills</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>

            <h1>Projects</h1>
            <p>Farming Web Simulator</p>
            <p>MehFilX</p>
            <p>CustomOS</p>
            <p>Quiz Application(console-based-only)</p>

        `);

    } else if (req.url === "/contact") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <a href="/">Home</a>
            <a href="/about">About Me</a>
            <a href="/skills">Skills</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>

            <h1>Contact Details</h1>
            <p>Name: LAxman Joshi</p>
            <p>Phone: 9876125430</p>
            <p>Email: laskhman@gmail.com</p>
            <p>LinkedIn: linkedin.com/in/lakshmanjosi </p>

        `);

    } else {

        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 - Page Not Found");

    }
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});