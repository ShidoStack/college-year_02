const express = require("express");
const mongoose = require("mongoose");

const teacherRouter = require("./router/teacherRouter");
const studentRouter = require("./router/studentRouter");

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/assignment11db")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.use("/teacher", teacherRouter);

app.use("/student", studentRouter);

app.get("/", (req, res) => {
    res.send("Assignment 11 - Teacher and Student Registration API is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});