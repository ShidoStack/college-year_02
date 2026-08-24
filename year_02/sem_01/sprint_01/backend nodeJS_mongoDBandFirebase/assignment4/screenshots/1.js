const fs = require("fs");

const student = `Name: Lokendra Joshi
Course: Full Stack Development
Technology: Node.js`;

fs.writeFile("student.txt", student, (err) => {
    if (err) {
        console.log("Error creating file:", err);
        return;
    }

    console.log("File created successfully");

    fs.readFile("student.txt", "utf8", (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        console.log("\nStudent Information");
        console.log(data);

        const addData = `Experience: 1 Year
City: Kolkata`;

        fs.appendFile("student.txt", addData, (err) => {
            if (err) {
                console.log("Error updating file:", err);
                return;
            }

            console.log("\nData updated successfully");

            
            fs.rename("student.txt", "studentDetails.txt", (err) => {
                if (err) {
                    console.log("Error renaming file:", err);
                    return;
                }

                console.log("File renamed successfully");

                fs.unlink("studentDetails.txt", (err) => {
                    if (err) {
                        console.log("Error deleting file:", err);
                        return;
                    }

                    console.log("File deleted successfully");
                });
            });
        });
    });
});