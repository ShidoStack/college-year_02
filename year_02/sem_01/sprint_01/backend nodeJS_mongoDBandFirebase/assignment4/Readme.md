## Assignment-4

## Student Details

- **Name:** Lokendra Joshi
- **Course:** Full Stack Development
- **Technology:** Node.js

## About the Assignment

This assignment demonstrates basic file handling operations in Node.js using the built-in `fs` (File System) module.

The program performs the following operations:

1. Creates and writes student information to a file using `fs.writeFile()`.
2. Reads the file using `fs.readFile()`.
3. Updates the file using `fs.appendFile()`.
4. Renames the file using `fs.rename()`.
5. Deletes the file using `fs.unlink()`.

## Files

```text
Assignment-4/
├── screenshots/
│   ├── 1.js
│   ├── task_1.1.png
│   ├── task_1.2.png
│   ├── task_2.png
│   ├── task_3.png
│   ├── task_4.png
│   ├── task_5.png
│   └── task_final.png
├── index.js
├── package.json
└── README.md
```

## How to Run

Make sure Node.js is installed.

Run the program:

```bash
node index.js
```

## Expected Output

When the program is executed using:

```bash
node index.js
```

The terminal displays the following output:

```text
File created successfully

Student Information:
--------------------
Name: Lokendra Joshi
Course: Full Stack Development
Technology: Node.js

Data updated successfully

Updated Student Information:
----------------------------
Name: Lokendra Joshi
Course: Full Stack Development
Technology: Node.js
Experience: 1 Year
City: Kolkata


Do you want to change file name of students.txt to studentDetails.txt? (yes/no):
```

### If the user enters `yes`

```text
Do you want to change file name of students.txt to studentDetails.txt? (yes/no): yes
File renamed successfully
```

### If the user enters `no`

```text
Do you want to change file name of students.txt to studentDetails.txt? (yes/no): no
File name was not changed.
```

Do you want to delete studentDetails.txt? (yes/no):
```

### If the user enters `yes`

```text
Do you want to delete studentDetails.txt? (yes/no): yes
File deleted successfully
```

The file `studentDetails.txt` is permanently deleted.

### If the user enters `no`

```text
Do you want to delete studentDetails.txt? (yes/no): no
File was not deleted.
```

The file `studentDetails.txt` is kept in the project directory.

## File System Methods Used

| Method | Purpose |
|---|---|
| `fs.writeFile()` | Creates and writes to a file |
| `fs.readFile()` | Reads file contents |
| `fs.appendFile()` | Adds data to an existing file |
| `fs.rename()` | Renames a file |
| `fs.unlink()` | Deletes a file |

## Output

### 1. File Creation

The screenshot below shows the successful creation of `student.txt` using `fs.writeFile()`.

![File Creation](Screenshots/task_1.1.png)
![File Creation](Screenshots/task_1.2.png)

---

### 2. Reading File

The screenshot below shows the student information being read from `student.txt` using `fs.readFile()`.

![Reading File](Screenshots/task_2.png)

---

### 3. Updating File

The screenshot below shows the additional student information being added using `fs.appendFile()`.

![Updating File](Screenshots/task_3.png)

---

### 4. Renaming File

The screenshot below shows the file being renamed from `student.txt` to `studentDetails.txt` using `fs.rename()`.

![Rename File](Screenshots/task_4.png)

---

### 5. Deleting File

The screenshot below shows the confirmation and successful deletion of `studentDetails.txt` using `fs.unlink()`.

![Delete File](Screenshots/task_5.png)

---

### 6. Final Output

The screenshot below shows the final output for the combined and formatted cource code of `index.js`.
![Final Output](Screenshots/task_final.png)
