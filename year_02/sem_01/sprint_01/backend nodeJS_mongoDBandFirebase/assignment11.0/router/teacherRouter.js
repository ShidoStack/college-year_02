const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Teacher = require("../model/teacherModel");

const router = express.Router();

// Teacher registration validation schema
const teacherValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    subject: Joi.string().required()
});

router.post("/register", async (req, res) => {
    try {
        // Validate registration data
        const { error, value } = teacherValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                error: error.details[0].message
            });
        }


        const hashedPassword = await bcrypt.hash(value.password, 10);
        const teacher = new Teacher({
            name: value.name,
            email: value.email,
            password: hashedPassword,
            subject: value.subject
        });

  
        const savedTeacher = await teacher.save();

        res.status(201).json({
            message: "Teacher registered successfully",
            teacher: {
                id: savedTeacher._id,
                name: savedTeacher.name,
                email: savedTeacher.email,
                subject: savedTeacher.subject
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering teacher",
            error: error.message
        });
    }
});

module.exports = router;