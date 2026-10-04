package smartlibrary.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Stores one borrowing transaction.
 */
public class BorrowRecord {
    private final String recordId;
    private final String bookId;
    private final String studentId;
    private final LocalDate issueDate;
    private final LocalDate dueDate;
    private LocalDate returnDate;

    public BorrowRecord(String recordId, String bookId, String studentId,
                        LocalDate issueDate, LocalDate dueDate) {
        this.recordId = recordId;
        this.bookId = bookId;
        this.studentId = studentId;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
    }

    public String getRecordId() { return recordId; }
    public String getBookId() { return bookId; }
    public String getStudentId() { return studentId; }
    public LocalDate getIssueDate() { return issueDate; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getReturnDate() { return returnDate; }

    public void markReturned(LocalDate date) {
        this.returnDate = date;
    }

    public boolean isActive() {
        return returnDate == null;
    }

    /**
     * Fine rule used by the demo:
     * Rs. 5 per day after the due date.
     */
    public double calculateFine(LocalDate asOfDate) {
        LocalDate endDate = returnDate != null ? returnDate : asOfDate;
        long lateDays = Math.max(0, ChronoUnit.DAYS.between(dueDate, endDate));
        return lateDays * 5.0;
    }
}
