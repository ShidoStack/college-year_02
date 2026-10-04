import java.time.LocalDate;

public class BorrowRecord {
    private String bookId;
    private String studentId;
    private LocalDate borrowDate;
    private LocalDate returnDate;

    public BorrowRecord(String bookId, String studentId, LocalDate borrowDate) {
        this.bookId = bookId;
        this.studentId = studentId;
        this.borrowDate = borrowDate;
    }

    public String getBookId() { return bookId; }
    public String getStudentId() { return studentId; }
    public LocalDate getBorrowDate() { return borrowDate; }
    public LocalDate getReturnDate() { return returnDate; }
    
    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }
}
