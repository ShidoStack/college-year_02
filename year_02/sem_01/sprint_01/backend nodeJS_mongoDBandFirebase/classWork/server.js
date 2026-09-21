const express = require("express");

const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
    res.json({
        message: "GET request successful"
    });
});

app.post("/students", (req, res) => {
    res.json({
        message: "POST request successful",
        student: req.body
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

