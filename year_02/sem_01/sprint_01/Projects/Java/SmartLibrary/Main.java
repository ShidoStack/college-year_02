import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        LibraryManager manager = new LibraryManager();
        
        // Seed some data
        manager.addBook(new Book("B1", "Java Programming", "James Gosling", 2020, new String[]{"Programming", "Java"}));
        manager.addBook(new Book("B2", "Data Structures", "Robert Lafore", 2018, new String[]{"CS", "Algorithms"}));
        manager.addBook(new Book("B3", "Effective Java", "Joshua Bloch", 2019, new String[]{"Programming", "Java"}));
        
        manager.addStudent(new Student("S1", "Alice"));
        manager.addStudent(new Student("S2", "Bob"));

        SwingUtilities.invokeLater(() -> {
            new LibraryGUI(manager).setVisible(true);
        });
    }
}
