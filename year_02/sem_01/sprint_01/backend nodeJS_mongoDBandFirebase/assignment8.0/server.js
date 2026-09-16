const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.use("/api", userRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});