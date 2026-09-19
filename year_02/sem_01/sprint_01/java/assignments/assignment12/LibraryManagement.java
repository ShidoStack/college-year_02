
import java.util.Scanner;

class Book {

    private int id;
    private String title;
    private String author;
    private boolean available;

    Book(int id, String title, String author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.available = true;
    }

    public void issueBook() {

        if (available) {
            available = false;
            System.out.println("Book '" + title + "' issued successfully.");
        } else {
            System.out.println("Book is already issued.");
        }
    }

    public void returnBook() {
        available = true;
        System.out.println("Book '" + title + "' returned successfully.");
    }

    public void displayBook() {

        System.out.println("Book ID: " + id);
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);

        if (available) {
            System.out.println("Status: Available");
        } else {
            System.out.println("Status: Issued");
        }
    }
}

public class LibraryManagement {

    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter book ID: ");
        int bookId = input.nextInt();
        input.nextLine();

        System.out.print("Enter book title: ");
        String bookTitle = input.nextLine();

        System.out.print("Enter author name: ");
        String authorName = input.nextLine();

        Book book = new Book(bookId, bookTitle, authorName);

        book.displayBook();

        System.out.print("\nEnter action (Issue/Return): ");
        String action = input.next();

        if (action.equalsIgnoreCase("Issue")) {
            book.issueBook();
        } else if (action.equalsIgnoreCase("Return")) {
            book.returnBook();
        } else {
            System.out.println("Invalid action.");
        }

        input.close();
    }
}
