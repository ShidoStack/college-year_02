const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Student = require("../model/studentModel");

const router = express.Router();

// Student registration validation schema
const studentValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    course: Joi.string().required(),
    age: Joi.number().integer().min(1).max(100).required()
});

// POST /student/register
router.post("/register", async (req, res) => {
    try {
        // Validate registration data
        const { error, value } = studentValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                error: error.details[0].message
            });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Create student with hashed password
        const student = new Student({
            name: value.name,
            email: value.email,
            password: hashedPassword,
            course: value.course,
            age: value.age
        });

        // Save student to MongoDB
        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student registered successfully",
            student: {
                id: savedStudent._id,
                name: savedStudent.name,
                email: savedStudent.email,
                course: savedStudent.course,
                age: savedStudent.age
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering student",
            error: error.message
        });
    }
});

module.exports = router;