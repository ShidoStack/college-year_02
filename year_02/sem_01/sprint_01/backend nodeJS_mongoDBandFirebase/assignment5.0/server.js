const express = require("express");
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("IP:", req.ip);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to Home Page");
});


app.get("/about", (req, res) => {
    res.send("This is About Page");
});


app.get("/contact", (req, res) => {
    res.send("This is Contact Page");
});


app.get("/user/:name", (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

app.get("/product/:id/:category", (req, res) => {
    res.send(`Product ID: ${req.params.id}, Category: ${req.params.category}`);
});

app.get("/search", (req, res) => {
    res.send(`Name: ${req.query.name}, Role: ${req.query.role}`);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
