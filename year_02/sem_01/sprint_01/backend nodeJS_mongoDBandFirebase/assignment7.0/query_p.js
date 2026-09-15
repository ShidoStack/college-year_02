const express = require("express");
const app = express();
const PORT = 3000;

app.get("/search", (req, res) => {
    const name = req.query.name;
    const course = req.query.course;

    if (!name && !course) {
        return res.send("No search data provided.");
    }

    res.send(`Name: ${name}<br>Course: ${course}`);

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});