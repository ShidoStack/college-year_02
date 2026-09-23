const mongoose = require("mongoose");
const teacherSchema = require("../schema/teacherSchema");

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;