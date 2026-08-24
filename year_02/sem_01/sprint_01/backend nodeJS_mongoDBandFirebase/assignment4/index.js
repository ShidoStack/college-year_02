const fs = require("fs");
const readline = require("readline");

const student = `Name: Lokendra Joshi
Course: Full Stack Development
Technology: Node.js`;


const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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


        const addData = `
Experience: 1 Year
City: Kolkata`;


        fs.appendFile("student.txt", addData, (err) => {
            if (err) {
                console.log("Error updating file:", err);
                return;
            }

            console.log("\nData updated successfully");

            fs.readFile("student.txt", "utf8", (err, data) => {
                if (err) {
                    console.log("Error reading updated file:", err);
                    return;
                }

                console.log("\nUpdated Student Information");
                console.log(data);

                input.question(
                    "\nDo you want to change the file name? (yes/no): ",
                    (answer) => {

                        if (answer.toLowerCase() === "yes") {
                            fs.rename(
                                "student.txt",
                                "studentDetails.txt",
                                (err) => {
                                    if (err) {
                                        console.log("Error renaming file:", err);
                                        input.close();
                                        return;
                                    }

                                    console.log("File renamed successfully");
                                    deleteFile("studentDetails.txt");
                                }
                            );
                        } else {
                            console.log("File name was not changed.");
                            deleteFile("student.txt");
                        }
                    }
                );
            });
        });
    });
});

function deleteFile(fileName) {
    input.question(
        `Do you want to delete ${fileName}? (yes/no): `,
        (answer) => {

            if (answer.toLowerCase() === "yes") {
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log("Error deleting file:", err);
                        input.close();
                        return;
                    }

                    console.log("File deleted successfully");
                    input.close();
                });
            } else {
                console.log("File was not deleted.");
                input.close();
            }
        }
    );
}