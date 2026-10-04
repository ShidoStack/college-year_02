import java.util.ArrayList;
import java.util.List;

public class Student {
    private String id;
    private String name;
    private List<String> borrowedBookIds;

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
        this.borrowedBookIds = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public List<String> getBorrowedBookIds() { return borrowedBookIds; }

    public void borrowBook(String bookId) {
        borrowedBookIds.add(bookId);
    }

    public void returnBook(String bookId) {
        borrowedBookIds.remove(bookId);
    }
}
