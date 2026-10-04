# Smart Library Recommendation System

## Java Programming Case Study Project

**Technology:** Java (JDK 17+)  
**GUI Framework:** Java Swing  
**Project Type:** Desktop Application  
**Domain:** College Library Management  

---

# 1. Project Overview

The Smart Library Recommendation System is a complete Java desktop application built to manage a college library's daily operations. It handles book inventory, student memberships, the issue and return workflow, and overdue fine calculations. 

The system models the main library operations using Object-Oriented principles and Java Collection frameworks.

The system is designed to answer practical library-management questions such as:
1. Which books are currently available versus issued?
2. What is the overdue fine for a specific student?
3. What is the borrowing history of a specific book or student?
4. What are the best book recommendations for a student based on their past reading history?
5. How many books exist in each category?

The project also demonstrates the practical application of multiple Java Collections (`ArrayList`, `LinkedList`, `HashMap`, `TreeMap`) and custom exceptions.

---

# 2. Problem Statement

Managing a library manually or using outdated software makes it difficult to maintain accurate records of:
- Available and issued books
- Student borrowing history
- Due dates and overdue fines
- Overall library statistics (e.g., category breakdowns)

A centralized desktop system can consolidate this information and allow librarians to manage operations efficiently using a graphical user interface.

The system must also preserve historical borrowing records so that the library can track which books a student has read and use that data to provide personalized recommendations.

---

# 3. Project Objectives

The main objectives of the project are:
- Model books, students, and borrowing records using Java classes.
- Store and manage data in-memory using various Java Collections.
- Maintain a complete borrowing history.
- Identify currently available and issued books.
- Calculate overdue fines using date-based arithmetic.
- Implement an intelligent recommendation engine based on user history.
- Answer important library-management queries using Java Streams and filtering.
- Demonstrate sorting, searching, and custom exception handling.
- Build a complete, themed Java Swing GUI.
- Document the project structure and design decisions clearly.

---

# 4. Technology Used

| Technology | Purpose |
|---|---|
| Java (JDK 17+) | Core programming language and logic |
| Java Swing | Graphical User Interface (GUI) framework |
| Java Collections Framework | In-memory data storage and manipulation |
| Java Time API (`LocalDate`) | Date tracking and fine calculation |
| Java Stream API | Searching, filtering, and data aggregation |

---

# 5. Class Structure

The application separates its concerns into distinct packages:

1. `model`: Contains data entities (`Book`, `Student`, `BorrowRecord`).
2. `service`: Contains the core business logic (`Library`).
3. `ui`: Contains the graphical interface (`LibraryFrame`, `Theme`).
4. `util`: Contains custom error handling (`ValidationException`).
5. `Main`: Application entry point.

This structure reduces coupling and separates the GUI from the underlying business logic.

---

# 6. Class Descriptions

## 6.1 `Book`

Stores individual library books.

Important fields:
- `id` — Unique identifier (e.g., B001)
- `title` — Book title
- `author` — Book author
- `category` — Genre/Category
- `year` — Publication year
- `available` — Boolean flag indicating if the book is currently in the library
- `tags` — Array of strings representing keywords

## 6.2 `Student`

Stores student information.

Important fields:
- `id` — Unique identifier (e.g., S001)
- `name` — Student's full name
- `course` — Student's enrolled course
- `email` — Contact email

## 6.3 `BorrowRecord`

Stores a single borrowing transaction.

Important fields:
- `recordId` — Unique transaction ID
- `bookId` — References a `Book`
- `studentId` — References a `Student`
- `issueDate` — Date the book was issued
- `dueDate` — Date the book is expected back
- `returnDate` — Date the book was actually returned

An active (unreturned) borrow record is represented by:
```java
returnDate == null
```

## 6.4 `Library`

The core service class managing all operations.

Important collections:
- `ArrayList<Book> books` — Primary book storage
- `ArrayList<Student> students` — Primary student storage
- `LinkedList<BorrowRecord> borrowingHistory` — Transaction history
- `HashMap<String, Book> booksById` — O(1) book lookups
- `TreeMap<String, Book> booksByTitle` — Alphabetically sorted books
- `HashMap<String, BorrowRecord> activeBorrowByBook` — Currently issued books

---

# 7. Object Relationships

The major conceptual relationships are:

```text
Library
   |
   ├── 1-to-many ──> Book
   |
   ├── 1-to-many ──> Student
   |
   └── 1-to-many ──> BorrowRecord
                          |
                          ├── references ──> Book
                          |
                          └── references ──> Student
```

---

# 8. Business Rules

The system implements the following important rules.

## Rule 1 — Unique IDs
Both Book IDs and Student IDs must be unique across the system. Attempting to add a duplicate ID throws a `ValidationException`.

## Rule 2 — Book Availability
A book cannot be issued if its `isAvailable()` flag is false. Attempting to do so throws a `ValidationException`.

## Rule 3 — Fine Calculation
If a book is returned after its `dueDate`, a fine is applied at the rate of **Rs. 5.0 per day**.

## Rule 4 — Historical Records are Retained
When a student returns a book, the `BorrowRecord` is not deleted. Instead, the `returnDate` is populated. This preserves history for the recommendation engine.

## Rule 5 — Deletion Constraints
- A `Book` cannot be deleted if it is currently issued.
- A `Student` cannot be deleted if they currently have an active borrowed book.

---

# 9. Seed Data

The project uses a realistic dataset instead of starting empty, so features can be tested immediately.

The seeded dataset contains:
- 8 Books across various categories (Programming, Fiction, Self Help, Networking, Database).
- 3 Students with different courses.
- A completed borrowing transaction (to demonstrate history and recommendations).
- An active borrowing transaction (to demonstrate unavailable-book handling and active fines).

---

# 10. Key Features (Required Workflows)

## 10.1 Book & Student Management (CRUD)
The system allows administrators to Create, Read, Update, and Delete books and students. All inputs are validated (e.g., year must be valid, names cannot be empty).

## 10.2 Issue / Return Workflow
The system issues books by verifying availability, generating a due date (14 days from issue), and creating a `BorrowRecord`. Returning a book calculates fines and restores availability.

## 10.3 Searching & Sorting
Books can be searched dynamically by ID, title, author, category, or tags. Books can be sorted by Title, Author, Year, or Category using Java `Comparator`s.

## 10.4 Fine Calculation
Fines are calculated dynamically up to the current day using `java.time.temporal.ChronoUnit.DAYS.between()`.

---

# 11. Intelligent Recommendation Engine

The most advanced feature is the recommendation engine.

**How it works:**
1. The system retrieves the selected student's `BorrowRecord` history.
2. It looks up every book the student has borrowed.
3. It creates a `HashMap<String, Integer> preferenceScore`.
4. It increments the score for the borrowed book's `category` and all its `tags`.
5. It then evaluates all *available* books in the library against this preference map.
6. Books matching high-frequency categories/tags get higher scores.
7. The books are sorted descending by score and displayed to the user.

---

# 12. Data Structure Design Decisions

## Decision 1 — `ArrayList` for primary storage
Used for `books` and `students` because it provides fast O(1) random access, which is ideal for populating JTables in the GUI.

## Decision 2 — `LinkedList` for borrowing history
New transactions are added using `addFirst()`. This naturally maintains a "most-recent-first" order without requiring the application to sort the history list every time it is viewed.

## Decision 3 — `HashMap` for ID lookups
`booksById` maps `String -> Book`. This provides O(1) lookup time when processing issue/return requests, rather than doing an O(N) linear search through the ArrayList.

## Decision 4 — `TreeMap` for title sorting
`booksByTitle` automatically maintains books in an alphabetically sorted order based on their titles.

---

# 13. UI and Theme Design

The GUI is built using standard Java Swing components (`JFrame`, `JTabbedPane`, `JTable`, `JOptionPane`). 

A centralized `Theme.java` class manages all colors, fonts, and border styles.
- **Header:** Dark Blue `#2d85be`
- **Buttons:** Muted Blue `#537997`
- **Tables:** Alternating shading with bold headers.

---

# 14. Project Files

The project directory contains:

```text
SmartLibraryRecommendationSystem/
│
├── README.md
├── SmartLibrary_Project_Report.docx
│
└── src/
    └── smartlibrary/
        ├── Main.java
        ├── model/
        │   ├── Book.java
        │   ├── Student.java
        │   └── BorrowRecord.java
        ├── service/
        │   └── Library.java
        ├── ui/
        │   ├── LibraryFrame.java
        │   └── Theme.java
        └── util/
            └── ValidationException.java
```

---

# 15. How to Run the Project

## Step 1 — Verify Requirements
Ensure you have **Java JDK 17** (or newer) installed. No external database or libraries are needed.

## Step 2 — Compile the code

Open your terminal in the project root folder:

**On Linux / macOS:**
```bash
javac -d out $(find src -name "*.java")
```

**On Windows (PowerShell):**
```powershell
Get-ChildItem -Recurse src -Filter *.java | ForEach-Object { $_.FullName } | javac -d out
```

## Step 3 — Run the Application
```bash
java -cp out smartlibrary.Main
```

---

# 16. Verification (How to test the app)

Once the application opens:
1. **Manage Books:** Try adding a new book. Search for "Java". Sort the table by "Year".
2. **Manage Students:** Try deleting a student.
3. **Issue/Return:** Issue book `B001` to student `S003`. Click "Active Issues" to see it.
4. **Recommendations:** Go to the Recommendations tab, select "Aarav Shah", and click get recommendations. You will see books matching his past history (Fiction/Adventure).
5. **Report:** Generate the library report to see the StringBuilder in action.

---

# 17. Conclusion

This project demonstrates how core Java programming concepts can be used to build a robust, in-memory application. 

By separating the data models, business logic, and UI layer, the architecture remains clean. The strategic use of different Java Collections (`ArrayList`, `LinkedList`, `HashMap`, `TreeMap`) ensures optimal performance for different access patterns.

Overall, the system provides a comprehensive, user-friendly desktop solution for library management.
