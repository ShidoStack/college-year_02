const express = require("express");
const db = require("./config/firebase");
const userRouter = require("./router/userRouter");

const app = express();
const PORT = 3000;

app.use(express.json());


app.use("/api", userRouter);

app.get("/", (req, res) => {
    res.send("Assignment 10 - Firebase Firestore API is running");
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});