const mongoose = require('mongoose');
const connectDbs = async () => {

    try {
        await mongoose.connect('mongodb://localhost:27017/studentDB');
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.log('MongoDB connection failed!');
        console.log(error);
    }
};

module.exports = connectDbs;

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    marks: Number
});



const Student = mongoose.model("Student", studentSchema);

const student = new Student({
    name: "Rahul Sharma",
    age: 20,
    email: "rahul@gmail.com",
    marks: 85
});



student.save()
    .then(() => {
        console.log("Student added successfully!");
    })
    .catch((error) => {
        console.log("Error:", error);
    });


const teacherSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    subject: String,
    salary: Number
});

const Teacher = mongoose.model("Teacher", teacherSchema);

const teacher = new Teacher({
    name: "Amit Sharma",
    age: 42,
    email: "amit@gmail.com",
    subject: "Mathematics",
    salary: 65000
});

teacher.save()
    .then(() => {
        console.log("Teacher added successfully!");
    })
    .catch((error) => {
        console.log("Error:", error);
    });

