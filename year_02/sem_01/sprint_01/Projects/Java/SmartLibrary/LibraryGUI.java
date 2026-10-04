import javax.swing.*;
import java.awt.*;
import java.util.List;

public class LibraryGUI extends JFrame {
    private LibraryManager manager;
    private JTextArea displayArea;

    public LibraryGUI(LibraryManager manager) {
        this.manager = manager;
        setTitle("Smart Library Recommendation System");
        setSize(600, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        displayArea = new JTextArea();
        displayArea.setEditable(false);
        add(new JScrollPane(displayArea), BorderLayout.CENTER);

        JPanel panel = new JPanel();
        panel.setLayout(new GridLayout(2, 3));

        JButton btnIssue = new JButton("Issue Book");
        JButton btnReturn = new JButton("Return Book");
        JButton btnSearch = new JButton("Search Book");
        JButton btnRecommend = new JButton("Recommendations");
        JButton btnReport = new JButton("Generate Report");

        panel.add(btnIssue);
        panel.add(btnReturn);
        panel.add(btnSearch);
        panel.add(btnRecommend);
        panel.add(btnReport);

        add(panel, BorderLayout.SOUTH);

        btnIssue.addActionListener(e -> issueBook());
        btnReturn.addActionListener(e -> returnBook());
        btnSearch.addActionListener(e -> searchBook());
        btnRecommend.addActionListener(e -> recommend());
        btnReport.addActionListener(e -> displayArea.setText(manager.generateReport()));
    }

    private void issueBook() {
        String bId = JOptionPane.showInputDialog("Enter Book ID:");
        String sId = JOptionPane.showInputDialog("Enter Student ID:");
        try {
            manager.issueBook(bId, sId);
            JOptionPane.showMessageDialog(this, "Book issued successfully.");
        } catch (LibraryException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void returnBook() {
        String bId = JOptionPane.showInputDialog("Enter Book ID:");
        String sId = JOptionPane.showInputDialog("Enter Student ID:");
        try {
            double fine = manager.returnBook(bId, sId);
            JOptionPane.showMessageDialog(this, "Returned. Fine: $" + fine);
        } catch (LibraryException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void searchBook() {
        String title = JOptionPane.showInputDialog("Enter Title to Search:");
        if (title != null) {
            List<Book> books = manager.searchBooksByTitle(title);
            displayArea.setText("Search Results:\n");
            for (Book b : books) displayArea.append(b.toString() + "\n");
        }
    }

    private void recommend() {
        String sId = JOptionPane.showInputDialog("Enter Student ID for Recommendations:");
        if (sId != null) {
            List<Book> books = manager.recommendBooks(sId);
            displayArea.setText("Recommendations:\n");
            for (Book b : books) displayArea.append(b.toString() + "\n");
        }
    }
}
