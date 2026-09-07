const express = require('express');
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    console.log(req.method, req.url, new Date().toLocaleString());
    next();
});


app.get('/', (req, res) => {
    res.send('Welcome to Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Us');
});

app.get('/contact', (req, res) => {
    res.send('Contact Information');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});