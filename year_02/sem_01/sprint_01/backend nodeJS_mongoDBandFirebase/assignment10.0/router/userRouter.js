const express = require("express");
const userSchema = require("../schema/userSchema");
const db = require("../config/firebase");

const router = express.Router();

// POST /api/users
router.post("/users", async (req, res) => {
    try {
        // Validate received data
        const { error, value } = userSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                error: error.details[0].message
            });
        }

        // Store validated data in Firestore
        const docRef = await db.collection("users").add(value);

        res.status(201).json({
            message: "User stored successfully",
            userId: docRef.id,
            user: value
        });

    } catch (error) {
        res.status(500).json({
            message: "Error storing user data",
            error: error.message
        });
    }
});

module.exports = router;