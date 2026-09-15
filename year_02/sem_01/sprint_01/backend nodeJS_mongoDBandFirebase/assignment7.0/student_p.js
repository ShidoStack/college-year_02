const express = require("express");
const app = express();
const PORT = 3000;

app.get("/student/:id", (req, res) => {

    const studentId = req.params.id;
    const name = req.query.name;
    const course = req.query.course;

    res.send(`
        Student ID: ${studentId}<br>
        Name: ${name}<br>
        Course: ${course}
    `);

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});