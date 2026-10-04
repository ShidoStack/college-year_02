import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class LibraryManager {
    private HashMap<String, Book> booksMap;
    private TreeMap<String, Book> booksSortedByTitle;
    private ArrayList<Student> studentsList;
    private LinkedList<BorrowRecord> borrowingHistory;
    
    private static final int MAX_BORROW_DAYS = 14;
    private static final double FINE_PER_DAY = 2.0;

    public LibraryManager() {
        booksMap = new HashMap<>();
        booksSortedByTitle = new TreeMap<>();
        studentsList = new ArrayList<>();
        borrowingHistory = new LinkedList<>();
    }

    public void addBook(Book book) {
        booksMap.put(book.getId(), book);
        booksSortedByTitle.put(book.getTitle(), book);
    }

    public void addStudent(Student student) {
        studentsList.add(student);
    }
    
    public Student getStudent(String id) {
        for (Student s : studentsList) {
            if (s.getId().equals(id)) return s;
        }
        return null;
    }

    public void issueBook(String bookId, String studentId) throws LibraryException {
        Book book = booksMap.get(bookId);
        if (book == null) throw new LibraryException("Invalid Book ID.");
        if (!book.isAvailable()) throw new LibraryException("Book is currently unavailable.");
        
        Student student = getStudent(studentId);
        if (student == null) throw new LibraryException("Invalid Student ID.");
        
        book.setAvailable(false);
        student.borrowBook(bookId);
        borrowingHistory.add(new BorrowRecord(bookId, studentId, LocalDate.now()));
    }

    public double returnBook(String bookId, String studentId) throws LibraryException {
        Book book = booksMap.get(bookId);
        if (book == null) throw new LibraryException("Invalid Book ID.");
        
        Student student = getStudent(studentId);
        if (student == null) throw new LibraryException("Invalid Student ID.");
        
        if (!student.getBorrowedBookIds().contains(bookId)) {
            throw new LibraryException("Student did not borrow this book.");
        }
        
        book.setAvailable(true);
        student.returnBook(bookId);
        
        // Find record and calculate fine
        for (BorrowRecord record : borrowingHistory) {
            if (record.getBookId().equals(bookId) && record.getStudentId().equals(studentId) && record.getReturnDate() == null) {
                record.setReturnDate(LocalDate.now());
                long daysBorrowed = ChronoUnit.DAYS.between(record.getBorrowDate(), LocalDate.now());
                if (daysBorrowed > MAX_BORROW_DAYS) {
                    return (daysBorrowed - MAX_BORROW_DAYS) * FINE_PER_DAY;
                }
                break;
            }
        }
        return 0.0;
    }

    public List<Book> searchBooksByTitle(String title) {
        List<Book> result = new ArrayList<>();
        for (Book b : booksMap.values()) {
            if (b.getTitle().toLowerCase().contains(title.toLowerCase())) {
                result.add(b);
            }
        }
        return result;
    }
    
    public List<Book> getSortedBooks() {
        return new ArrayList<>(booksSortedByTitle.values());
    }

    public List<Book> recommendBooks(String studentId) {
        Student student = getStudent(studentId);
        if (student == null || student.getBorrowedBookIds().isEmpty()) {
            return getSortedBooks(); // Simple fallback
        }
        
        // Recommend based on previously borrowed categories
        Set<String> preferredCategories = new HashSet<>();
        for (String bId : student.getBorrowedBookIds()) {
            Book b = booksMap.get(bId);
            if (b != null) {
                preferredCategories.addAll(Arrays.asList(b.getCategories()));
            }
        }
        
        List<Book> recommendations = new ArrayList<>();
        for (Book b : booksMap.values()) {
            if (b.isAvailable() && !student.getBorrowedBookIds().contains(b.getId())) {
                for (String cat : b.getCategories()) {
                    if (preferredCategories.contains(cat)) {
                        recommendations.add(b);
                        break;
                    }
                }
            }
        }
        return recommendations;
    }
    
    public String generateReport() {
        StringBuilder sb = new StringBuilder("Library Report:\n");
        sb.append("Total Books: ").append(booksMap.size()).append("\n");
        sb.append("Total Students: ").append(studentsList.size()).append("\n");
        sb.append("Total Borrow Records: ").append(borrowingHistory.size()).append("\n");
        return sb.toString();
    }
}
