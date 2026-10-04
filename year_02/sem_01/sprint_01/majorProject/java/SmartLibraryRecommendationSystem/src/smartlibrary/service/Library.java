package smartlibrary.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import smartlibrary.model.Book;
import smartlibrary.model.BorrowRecord;
import smartlibrary.model.Student;
import smartlibrary.util.ValidationException;

/**
 * Core library business logic.
 *
 * Collections required by the case study:
 * - ArrayList: primary collections for books/students.
 * - LinkedList: borrowing history.
 * - HashMap: fast Book ID -> Book lookup.
 * - TreeMap: books ordered by title.
 */
public class Library {
    private final ArrayList<Book> books = new ArrayList<>();
    private final ArrayList<Student> students = new ArrayList<>();
    private final LinkedList<BorrowRecord> borrowingHistory = new LinkedList<>();
    private final HashMap<String, Book> booksById = new HashMap<>();
    private final TreeMap<String, Book> booksByTitle = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
    private final HashMap<String, BorrowRecord> activeBorrowByBook = new HashMap<>();

    private int recordCounter = 1001;

    public Library() {
        seedData();
    }

    // -------------------- CRUD: BOOKS --------------------

    public void addBook(Book book) throws ValidationException {
        validateText(book.getId(), "Book ID");
        validateText(book.getTitle(), "Book title");
        validateText(book.getAuthor(), "Author");
        validateText(book.getCategory(), "Category");

        if (book.getYear() < 1000 || book.getYear() > LocalDate.now().getYear()) {
            throw new ValidationException("Book year must be between 1000 and the current year.");
        }
        if (booksById.containsKey(book.getId())) {
            throw new ValidationException("Book ID already exists: " + book.getId());
        }

        books.add(book);
        booksById.put(book.getId(), book);
        booksByTitle.put(book.getTitle(), book);
    }

    public void updateBook(Book book) throws ValidationException {
        if (!booksById.containsKey(book.getId())) {
            throw new ValidationException("Book not found: " + book.getId());
        }
        validateText(book.getTitle(), "Book title");
        validateText(book.getAuthor(), "Author");
        validateText(book.getCategory(), "Category");

        Book old = booksById.get(book.getId());
        booksByTitle.remove(old.getTitle());

        old.setTitle(book.getTitle());
        old.setAuthor(book.getAuthor());
        old.setCategory(book.getCategory());
        old.setYear(book.getYear());

        booksByTitle.put(old.getTitle(), old);
    }

    public void deleteBook(String bookId) throws ValidationException {
        Book book = findBook(bookId);
        if (!book.isAvailable()) {
            throw new ValidationException("Cannot delete a book that is currently issued.");
        }

        books.remove(book);
        booksById.remove(bookId);
        booksByTitle.remove(book.getTitle());
    }

    public Book findBook(String id) throws ValidationException {
        Book book = booksById.get(id);
        if (book == null) {
            throw new ValidationException("Book ID not found: " + id);
        }
        return book;
    }

    // -------------------- CRUD: STUDENTS --------------------

    public void addStudent(Student student) throws ValidationException {
        validateText(student.getId(), "Student ID");
        validateText(student.getName(), "Student name");
        validateText(student.getCourse(), "Course");
        validateText(student.getEmail(), "Email");

        if (students.stream().anyMatch(s -> s.getId().equalsIgnoreCase(student.getId()))) {
            throw new ValidationException("Student ID already exists: " + student.getId());
        }

        students.add(student);
    }

    public void updateStudent(Student updated) throws ValidationException {
        Student old = findStudent(updated.getId());
        old.setName(updated.getName());
        old.setCourse(updated.getCourse());
        old.setEmail(updated.getEmail());
    }

    public void deleteStudent(String studentId) throws ValidationException {
        findStudent(studentId);

        boolean hasActiveBorrow = borrowingHistory.stream()
                .anyMatch(r -> r.getStudentId().equalsIgnoreCase(studentId) && r.isActive());

        if (hasActiveBorrow) {
            throw new ValidationException("Cannot delete a student with an active borrowed book.");
        }

        students.removeIf(s -> s.getId().equalsIgnoreCase(studentId));
    }

    public Student findStudent(String id) throws ValidationException {
        return students.stream()
                .filter(s -> s.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ValidationException("Student ID not found: " + id));
    }

    // -------------------- ISSUE / RETURN --------------------

    public BorrowRecord issueBook(String bookId, String studentId) throws ValidationException {
        Book book = findBook(bookId);
        findStudent(studentId);

        if (!book.isAvailable()) {
            throw new ValidationException("Book is currently unavailable.");
        }

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(14);

        BorrowRecord record = new BorrowRecord(
                "BR" + recordCounter++,
                bookId,
                studentId,
                issueDate,
                dueDate
        );

        book.setAvailable(false);
        borrowingHistory.addFirst(record);
        activeBorrowByBook.put(bookId, record);

        return record;
    }

    public BorrowRecord returnBook(String bookId) throws ValidationException {
        Book book = findBook(bookId);
        if (book.isAvailable()) {
            throw new ValidationException("This book is not currently issued.");
        }

        BorrowRecord record = activeBorrowByBook.get(bookId);
        if (record == null) {
            throw new ValidationException("Active borrowing record not found.");
        }

        record.markReturned(LocalDate.now());
        activeBorrowByBook.remove(bookId);
        book.setAvailable(true);

        return record;
    }

    // -------------------- SEARCHING --------------------

    public List<Book> searchBooks(String query) {
        String q = query == null ? "" : query.trim().toLowerCase();

        return books.stream()
                .filter(book ->
                        book.getId().toLowerCase().contains(q)
                        || book.getTitle().toLowerCase().contains(q)
                        || book.getAuthor().toLowerCase().contains(q)
                        || book.getCategory().toLowerCase().contains(q)
                        || book.tagsAsText().toLowerCase().contains(q))
                .toList();
    }

    public List<Book> searchByCategory(String category) {
        return books.stream()
                .filter(b -> b.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    // -------------------- SORTING --------------------

    public List<Book> getBooksSortedBy(String field) {
        ArrayList<Book> result = new ArrayList<>(books);

        Comparator<Book> comparator = switch (field.toLowerCase()) {
            case "author" -> Comparator.comparing(Book::getAuthor, String.CASE_INSENSITIVE_ORDER);
            case "year" -> Comparator.comparingInt(Book::getYear);
            case "category" -> Comparator.comparing(Book::getCategory, String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(Book::getTitle, String.CASE_INSENSITIVE_ORDER);
        };

        result.sort(comparator);
        return result;
    }

    public List<Book> getBooksByTreeMap() {
        return new ArrayList<>(booksByTitle.values());
    }

    // -------------------- RECOMMENDATION --------------------

    /**
     * Simple recommendation: count the categories/tags in a student's
     * borrowing history, then return available books matching those interests.
     */
    public List<Book> recommendForStudent(String studentId) throws ValidationException {
        findStudent(studentId);

        HashMap<String, Integer> preferenceScore = new HashMap<>();

        for (BorrowRecord record : borrowingHistory) {
            if (record.getStudentId().equalsIgnoreCase(studentId)) {
                Book borrowed = booksById.get(record.getBookId());
                if (borrowed != null) {
                    addScore(preferenceScore, borrowed.getCategory());
                    for (String tag : borrowed.getTags()) {
                        addScore(preferenceScore, tag);
                    }
                }
            }
        }

        return books.stream()
                .filter(Book::isAvailable)
                .filter(book -> {
                    int score = preferenceScore.getOrDefault(book.getCategory(), 0);
                    for (String tag : book.getTags()) {
                        score += preferenceScore.getOrDefault(tag, 0);
                    }
                    return score > 0;
                })
                .sorted(Comparator.comparingInt((Book b) -> recommendationScore(b, preferenceScore)).reversed()
                        .thenComparing(Book::getTitle, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private int recommendationScore(Book book, Map<String, Integer> preferenceScore) {
        int score = preferenceScore.getOrDefault(book.getCategory(), 0);
        for (String tag : book.getTags()) {
            score += preferenceScore.getOrDefault(tag, 0);
        }
        return score;
    }

    private void addScore(Map<String, Integer> map, String key) {
        map.put(key, map.getOrDefault(key, 0) + 1);
    }

    // -------------------- REPORTS / GETTERS --------------------

    public List<Book> getBooks() {
        return new ArrayList<>(books);
    }

    public List<Student> getStudents() {
        return new ArrayList<>(students);
    }

    public List<BorrowRecord> getBorrowingHistory() {
        return new ArrayList<>(borrowingHistory);
    }

    public int getTotalBooks() {
        return books.size();
    }

    public int getAvailableBooks() {
        return (int) books.stream().filter(Book::isAvailable).count();
    }

    public int getIssuedBooks() {
        return books.size() - getAvailableBooks();
    }

    public int getTotalStudents() {
        return students.size();
    }

    public int getActiveBorrowCount() {
        return activeBorrowByBook.size();
    }

    public double calculateStudentFine(String studentId) throws ValidationException {
        findStudent(studentId);
        return borrowingHistory.stream()
                .filter(r -> r.getStudentId().equalsIgnoreCase(studentId))
                .mapToDouble(r -> r.calculateFine(LocalDate.now()))
                .sum();
    }

    public double calculateTotalFines() {
        return borrowingHistory.stream()
                .mapToDouble(r -> r.calculateFine(LocalDate.now()))
                .sum();
    }

    public String generateReport() {
        StringBuilder report = new StringBuilder();
        report.append("SMART LIBRARY REPORT\n");
        report.append("=====================\n");
        report.append("Generated: ").append(LocalDate.now()).append("\n\n");
        report.append("Total books     : ").append(getTotalBooks()).append("\n");
        report.append("Available books : ").append(getAvailableBooks()).append("\n");
        report.append("Issued books    : ").append(getIssuedBooks()).append("\n");
        report.append("Students        : ").append(getTotalStudents()).append("\n");
        report.append("Transactions    : ").append(borrowingHistory.size()).append("\n");
        report.append("Active issues   : ").append(getActiveBorrowCount()).append("\n");
        report.append(String.format("Total fines     : Rs. %.2f%n", calculateTotalFines()));
        return report.toString();
    }

    // -------------------- VALIDATION --------------------

    private void validateText(String value, String field) throws ValidationException {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(field + " cannot be empty.");
        }
    }

    // -------------------- DEMO DATA --------------------

    private void seedData() {
        try {
            addBook(new Book("B001", "Clean Code", "Robert C. Martin",
                    "Programming", 2008, new String[]{"Java", "Software", "Clean Code"}));
            addBook(new Book("B002", "Effective Java", "Joshua Bloch",
                    "Programming", 2018, new String[]{"Java", "Best Practices"}));
            addBook(new Book("B003", "The Alchemist", "Paulo Coelho",
                    "Fiction", 1988, new String[]{"Adventure", "Life"}));
            addBook(new Book("B004", "Atomic Habits", "James Clear",
                    "Self Help", 2018, new String[]{"Habits", "Productivity"}));
            addBook(new Book("B005", "Computer Networks", "Andrew S. Tanenbaum",
                    "Networking", 2010, new String[]{"Networks", "TCP/IP"}));
            addBook(new Book("B006", "Database System Concepts", "Abraham Silberschatz",
                    "Database", 2019, new String[]{"DBMS", "SQL"}));
            addBook(new Book("B007", "Introduction to Algorithms", "Thomas H. Cormen",
                    "Algorithms", 2022, new String[]{"DSA", "Algorithms"}));
            addBook(new Book("B008", "The Pragmatic Programmer", "David Thomas",
                    "Programming", 2019, new String[]{"Programming", "Software"}));

            addStudent(new Student("S001", "Aarav Shah", "B.Tech CSE", "aarav@college.edu"));
            addStudent(new Student("S002", "Meera Patel", "B.Tech IT", "meera@college.edu"));
            addStudent(new Student("S003", "Rohan Joshi", "B.Tech CSE", "rohan@college.edu"));

            // One completed borrowing transaction demonstrates history/recommendations.
            BorrowRecord demo = issueBook("B003", "S001");
            returnBook("B003");

            // Another active transaction demonstrates unavailable-book handling.
            issueBook("B002", "S002");
        } catch (ValidationException e) {
            // Seed data is hard-coded and expected to be valid.
            throw new IllegalStateException("Unable to initialize demo library.", e);
        }
    }
}
