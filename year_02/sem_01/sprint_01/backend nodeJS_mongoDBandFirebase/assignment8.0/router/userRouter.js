const express = require("express");
const User = require("../model/userModel");
const router = express.Router();


router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            message: "User added successfully",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding user",
            error: error.message
        });
    }
});


router.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving users",
            error: error.message
        });
    }
});

module.exports = router;