const express = require("express");

const visitCounter = require("./middleware/visitCounter");

const app = express();

const PORT = 5001;


// Apply middleware only to page routes
app.get("/home", visitCounter, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Home page"
    });
});


app.get("/about", visitCounter, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the About page"
    });
});


app.get("/contact", visitCounter, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Contact page"
    });
});


// Statistics route
// IMPORTANT: No visitCounter middleware here
app.get("/visits", (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const visitsFile = path.join(__dirname, "visits.json");

    try {
        const data = fs.readFileSync(visitsFile, "utf8");

        const visits = JSON.parse(data);

        res.status(200).json({
            success: true,
            data: visits
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to read visit statistics"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});