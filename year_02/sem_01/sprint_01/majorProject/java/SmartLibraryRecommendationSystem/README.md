# Smart Library Recommendation System

A complete Java Swing case-study project for the "Smart Library Recommendation System".

## Requirements
- Java JDK 17 or newer
- No external libraries are required.

## Project structure
```text
SmartLibraryRecommendationSystem/
├── README.md
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

## Run from terminal

From the project root:

```bash
javac -d out $(find src -name "*.java")
java -cp out smartlibrary.Main
```

On Windows PowerShell:

```powershell
Get-ChildItem -Recurse src -Filter *.java | ForEach-Object { $_.FullName } | javac -d out
java -cp out smartlibrary.Main
```

## Main implemented concepts
- Classes and objects
- Constructors
- Arrays for book categories/tags
- ArrayList for books and students
- LinkedList for borrowing history
- HashMap for Book ID -> Book
- TreeMap for books sorted by title
- CRUD operations
- Searching by title, author, category
- Sorting by title, author and year
- Issue / return workflow
- Borrowing history
- Fine calculation
- Recommendation based on categories/tags and student history
- Validation and exception handling
- Java Swing GUI
