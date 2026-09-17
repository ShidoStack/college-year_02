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



router.patch("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(
            id,
            req.body,
            { returnDocument: "after" }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: user
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid MongoDB ID"
            });
        }

        res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }
});



router.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid MongoDB ID"
            });
        }

        res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }
});

module.exports = router;