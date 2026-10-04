package smartlibrary.ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSeparator;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

import smartlibrary.model.Book;
import smartlibrary.model.BorrowRecord;
import smartlibrary.model.Student;
import smartlibrary.service.Library;
import smartlibrary.util.ValidationException;

/**
 * Main Swing GUI.
 *
 * The layout deliberately follows the supplied previous-project reference:
 * a blue title/header area, dark action sidebar, tabbed data area, and
 * a system-console section at the bottom.
 */
public class LibraryFrame extends JFrame {
    private final Library library = new Library();

    private final JTabbedPane tabs = new JTabbedPane();
    private final JTable booksTable = createTable();
    private final JTable studentsTable = createTable();
    private final JTable borrowTable = createTable();
    private final JTable recommendationTable = createTable();

    private final JLabel statusLabel = new JLabel("System ready.");

    private final JTextField bookSearchField = new JTextField();
    private final JComboBox<String> sortCombo =
            new JComboBox<>(new String[]{"Title", "Author", "Year", "Category"});

    private final DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public LibraryFrame() {
        setTitle("Smart Library Recommendation System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(1200, 760));
        setSize(1420, 900);
        setLocationRelativeTo(null);

        buildUI();
        refreshAll();
        log("System ready. Welcome to Smart Library.");
    }

    private void buildUI() {
        setLayout(new BorderLayout());

        add(createHeader(), BorderLayout.NORTH);
        add(createMainArea(), BorderLayout.CENTER);
    }

    // -------------------- HEADER --------------------

    private JPanel createHeader() {
        JPanel header = new JPanel(new FlowLayout(FlowLayout.CENTER));
        header.setBackground(Theme.HEADER);
        header.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel title = new JLabel("SMART LIBRARY RECOMMENDATION SYSTEM");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 22));
        
        header.add(title);
        return header;
    }

    // -------------------- SIDEBAR --------------------

    // -------------------- MAIN AREA --------------------

    private JPanel createMainArea() {
        tabs.setFont(new Font("SansSerif", Font.BOLD, 14));
        
        tabs.addTab("1. Manage Books", createBooksTab());
        tabs.addTab("2. Manage Students", createStudentsTab());
        tabs.addTab("3. Issue / Return", createBorrowTab());
        tabs.addTab("4. Recommendations", createRecommendationTab());
        tabs.addTab("5. Generate Report", createReportTab());

        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.add(tabs, BorderLayout.CENTER);
        return mainPanel;
    }

    private JPanel createBooksTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Theme.PANEL);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        controls.setBackground(Theme.PANEL);
        controls.setBorder(BorderFactory.createTitledBorder("Manage Books & Search Filters"));
        
        controls.add(new JLabel("Search:"));
        bookSearchField.setPreferredSize(new Dimension(150, 25));
        controls.add(bookSearchField);
        JButton searchBtn = new JButton("Search");
        Theme.styleButton(searchBtn);
        searchBtn.addActionListener(e -> searchBooks());
        controls.add(searchBtn);

        controls.add(new JLabel("Sort by:"));
        controls.add(sortCombo);
        JButton sortBtn = new JButton("Apply");
        Theme.styleButton(sortBtn);
        sortBtn.addActionListener(e -> sortBooks());
        controls.add(sortBtn);

        JButton addBtn = new JButton("Add Book");
        Theme.styleButton(addBtn);
        addBtn.addActionListener(e -> showBookDialog(null));
        controls.add(addBtn);

        JButton editBtn = new JButton("Edit");
        Theme.styleButton(editBtn);
        editBtn.addActionListener(e -> editSelectedBook());
        controls.add(editBtn);
        
        JButton delBtn = new JButton("Delete");
        Theme.styleButton(delBtn);
        delBtn.addActionListener(e -> deleteSelectedBook());
        controls.add(delBtn);

        panel.add(controls, BorderLayout.NORTH);
        panel.add(new JScrollPane(booksTable), BorderLayout.CENTER);

        return panel;
    }

    private JPanel createStudentsTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Theme.PANEL);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        controls.setBackground(Theme.PANEL);
        controls.setBorder(BorderFactory.createTitledBorder("Manage Students Controls"));
        
        JButton addBtn = new JButton("Add Student");
        Theme.styleButton(addBtn);
        addBtn.addActionListener(e -> showStudentDialog(null));
        controls.add(addBtn);

        JButton editBtn = new JButton("Edit");
        Theme.styleButton(editBtn);
        editBtn.addActionListener(e -> editSelectedStudent());
        controls.add(editBtn);
        
        JButton delBtn = new JButton("Delete");
        Theme.styleButton(delBtn);
        delBtn.addActionListener(e -> deleteSelectedStudent());
        controls.add(delBtn);
        
        JButton fineBtn = new JButton("Calculate Fine");
        Theme.styleButton(fineBtn);
        fineBtn.addActionListener(e -> fineDialog());
        controls.add(fineBtn);

        panel.add(controls, BorderLayout.NORTH);
        panel.add(new JScrollPane(studentsTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createBorrowTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Theme.PANEL);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        controls.setBackground(Theme.PANEL);
        controls.setBorder(BorderFactory.createTitledBorder("Issue & Return Controls"));

        JButton issueBtn = new JButton("Issue Book");
        Theme.styleButton(issueBtn);
        issueBtn.addActionListener(e -> issueBookDialog());
        controls.add(issueBtn);
        
        JButton returnBtn = new JButton("Return Book");
        Theme.styleButton(returnBtn);
        returnBtn.addActionListener(e -> returnBookDialog());
        controls.add(returnBtn);

        JButton activeOnly = new JButton("Active Issues");
        Theme.styleButton(activeOnly);
        activeOnly.addActionListener(e -> showActiveBorrowRecords());
        controls.add(activeOnly);

        JButton all = new JButton("All History");
        Theme.styleButton(all);
        all.addActionListener(e -> showBorrowingHistory());
        controls.add(all);

        panel.add(controls, BorderLayout.NORTH);
        panel.add(new JScrollPane(borrowTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createRecommendationTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Theme.PANEL);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        controls.setBackground(Theme.PANEL);
        controls.setBorder(BorderFactory.createTitledBorder("Recommendations"));

        JButton recommend = new JButton("Get Recommendations");
        Theme.styleButton(recommend);
        recommend.addActionListener(e -> recommendationDialog());
        controls.add(recommend);

        panel.add(controls, BorderLayout.NORTH);
        panel.add(new JScrollPane(recommendationTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createReportTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Theme.PANEL);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        controls.setBackground(Theme.PANEL);
        controls.setBorder(BorderFactory.createTitledBorder("Generate Library Report"));
        
        JButton reportBtn = new JButton("Generate Report");
        Theme.styleButton(reportBtn);
        reportBtn.addActionListener(e -> showReport());
        controls.add(reportBtn);

        panel.add(controls, BorderLayout.NORTH);
        return panel;
    }

    // -------------------- TABLES --------------------

    private JTable createTable() {
        JTable table = new JTable();
        table.setFont(Theme.NORMAL_FONT);
        table.setRowHeight(27);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setAutoCreateRowSorter(true);
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 13));
        table.getTableHeader().setBackground(Theme.TABLE_HEADER);
        table.getTableHeader().setForeground(Theme.TEXT);

        DefaultTableCellRenderer renderer = new DefaultTableCellRenderer();
        renderer.setBorder(BorderFactory.createEmptyBorder(0, 6, 0, 6));
        table.setDefaultRenderer(Object.class, renderer);

        return table;
    }

    private void refreshAll() {
        refreshBookTable(library.getBooks());
        refreshStudentTable();
        refreshBorrowTable(library.getBorrowingHistory());
        refreshRecommendationTable(List.of());
        updateStatus();
    }

    private void refreshBookTable(List<Book> list) {
        DefaultTableModel model = new DefaultTableModel(
                new String[]{"Book ID", "Title", "Author", "Category", "Year", "Tags", "Status"}, 0) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        };

        for (Book b : list) {
            model.addRow(new Object[]{
                    b.getId(), b.getTitle(), b.getAuthor(), b.getCategory(),
                    b.getYear(), b.tagsAsText(), b.isAvailable() ? "Available" : "Issued"
            });
        }
        booksTable.setModel(model);
    }

    private void refreshStudentTable() {
        DefaultTableModel model = new DefaultTableModel(
                new String[]{"Student ID", "Name", "Course", "Email", "Active Books", "Fine"}, 0) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        };

        for (Student s : library.getStudents()) {
            int active = 0;
            try {
                for (BorrowRecord r : library.getBorrowingHistory()) {
                    if (r.getStudentId().equalsIgnoreCase(s.getId()) && r.isActive()) active++;
                }
                model.addRow(new Object[]{
                        s.getId(), s.getName(), s.getCourse(), s.getEmail(),
                        active, String.format("Rs. %.2f", library.calculateStudentFine(s.getId()))
                });
            } catch (ValidationException ignored) {
                // Student came from Library, so this should not happen.
            }
        }
        studentsTable.setModel(model);
    }

    private void refreshBorrowTable(List<BorrowRecord> records) {
        DefaultTableModel model = new DefaultTableModel(
                new String[]{"Record ID", "Book ID", "Book Title", "Student ID", "Student Name",
                        "Issue Date", "Due Date", "Return Date", "Status", "Fine"}, 0) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        };

        for (BorrowRecord r : records) {
            String bookTitle = "Unknown";
            String studentName = "Unknown";
            try {
                bookTitle = library.findBook(r.getBookId()).getTitle();
                studentName = library.findStudent(r.getStudentId()).getName();
            } catch (ValidationException ignored) { }

            model.addRow(new Object[]{
                    r.getRecordId(),
                    r.getBookId(),
                    bookTitle,
                    r.getStudentId(),
                    studentName,
                    r.getIssueDate().format(dateFormat),
                    r.getDueDate().format(dateFormat),
                    r.getReturnDate() == null ? "-" : r.getReturnDate().format(dateFormat),
                    r.isActive() ? "ACTIVE" : "Returned",
                    String.format("Rs. %.2f", r.calculateFine(java.time.LocalDate.now()))
            });
        }

        borrowTable.setModel(model);
    }

    private void refreshRecommendationTable(List<Book> books) {
        DefaultTableModel model = new DefaultTableModel(
                new String[]{"Book ID", "Title", "Author", "Category", "Year", "Tags", "Availability"}, 0) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        };

        for (Book b : books) {
            model.addRow(new Object[]{
                    b.getId(), b.getTitle(), b.getAuthor(), b.getCategory(),
                    b.getYear(), b.tagsAsText(), b.isAvailable() ? "Available" : "Issued"
            });
        }

        recommendationTable.setModel(model);
    }

    // -------------------- BOOK ACTIONS --------------------

    private void showBookDialog(Book existing) {
        JDialog dialog = new JDialog(this, existing == null ? "Add Book" : "Edit Book", true);
        dialog.setSize(520, 450);
        dialog.setLocationRelativeTo(this);

        JTextField id = new JTextField(existing == null ? "" : existing.getId());
        JTextField title = new JTextField(existing == null ? "" : existing.getTitle());
        JTextField author = new JTextField(existing == null ? "" : existing.getAuthor());
        JTextField category = new JTextField(existing == null ? "" : existing.getCategory());
        JTextField year = new JTextField(existing == null ? "" : String.valueOf(existing.getYear()));
        JTextField tags = new JTextField(existing == null ? "" : existing.tagsAsText());

        if (existing != null) id.setEditable(false);

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(BorderFactory.createEmptyBorder(18, 18, 10, 18));

        addFormRow(form, 0, "Book ID:", id);
        addFormRow(form, 1, "Title:", title);
        addFormRow(form, 2, "Author:", author);
        addFormRow(form, 3, "Category:", category);
        addFormRow(form, 4, "Year:", year);
        addFormRow(form, 5, "Tags:", tags);

        JButton save = new JButton(existing == null ? "Add Book" : "Save Changes");
        JButton cancel = new JButton("Cancel");
        Theme.styleButton(save);
        Theme.styleButton(cancel);

        save.addActionListener(e -> {
            try {
                int bookYear = Integer.parseInt(year.getText().trim());
                String[] tagArray = tags.getText().trim().isEmpty()
                        ? new String[0]
                        : tags.getText().split("\\s*,\\s*");

                Book book = new Book(
                        id.getText().trim(), title.getText().trim(), author.getText().trim(),
                        category.getText().trim(), bookYear, tagArray
                );

                if (existing == null) {
                    library.addBook(book);
                    log("Book added: " + book.getId() + " - " + book.getTitle());
                } else {
                    library.updateBook(book);
                    log("Book updated: " + book.getId());
                }

                refreshAll();
                dialog.dispose();
            } catch (NumberFormatException ex) {
                showError("Year must be a valid number.");
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        });

        cancel.addActionListener(e -> dialog.dispose());

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttons.add(cancel);
        buttons.add(save);

        dialog.setLayout(new BorderLayout());
        dialog.add(form, BorderLayout.CENTER);
        dialog.add(buttons, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void editSelectedBook() {
        int row = booksTable.getSelectedRow();
        if (row < 0) {
            showError("Select a book from the Books table first.");
            return;
        }

        int modelRow = booksTable.convertRowIndexToModel(row);
        String id = String.valueOf(booksTable.getModel().getValueAt(modelRow, 0));

        try {
            showBookDialog(library.findBook(id));
        } catch (ValidationException e) {
            showError(e.getMessage());
        }
    }

    private void deleteSelectedBook() {
        int row = booksTable.getSelectedRow();
        if (row < 0) {
            showError("Select a book from the Books table first.");
            return;
        }

        int modelRow = booksTable.convertRowIndexToModel(row);
        String id = String.valueOf(booksTable.getModel().getValueAt(modelRow, 0));

        if (confirm("Delete book " + id + "?")) {
            try {
                library.deleteBook(id);
                log("Book deleted: " + id);
                refreshAll();
            } catch (ValidationException e) {
                showError(e.getMessage());
            }
        }
    }

    // -------------------- STUDENT ACTIONS --------------------

    private void showStudentDialog(Student existing) {
        JDialog dialog = new JDialog(this, existing == null ? "Add Student" : "Edit Student", true);
        dialog.setSize(500, 360);
        dialog.setLocationRelativeTo(this);

        JTextField id = new JTextField(existing == null ? "" : existing.getId());
        JTextField name = new JTextField(existing == null ? "" : existing.getName());
        JTextField course = new JTextField(existing == null ? "" : existing.getCourse());
        JTextField email = new JTextField(existing == null ? "" : existing.getEmail());

        if (existing != null) id.setEditable(false);

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(BorderFactory.createEmptyBorder(18, 18, 10, 18));
        addFormRow(form, 0, "Student ID:", id);
        addFormRow(form, 1, "Name:", name);
        addFormRow(form, 2, "Course:", course);
        addFormRow(form, 3, "Email:", email);

        JButton save = new JButton(existing == null ? "Add Student" : "Save Changes");
        JButton cancel = new JButton("Cancel");
        Theme.styleButton(save);
        Theme.styleButton(cancel);

        save.addActionListener(e -> {
            try {
                Student student = new Student(
                        id.getText().trim(), name.getText().trim(),
                        course.getText().trim(), email.getText().trim()
                );

                if (existing == null) {
                    library.addStudent(student);
                    log("Student added: " + student.getId() + " - " + student.getName());
                } else {
                    library.updateStudent(student);
                    log("Student updated: " + student.getId());
                }

                refreshAll();
                dialog.dispose();
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        });

        cancel.addActionListener(e -> dialog.dispose());

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttons.add(cancel);
        buttons.add(save);

        dialog.setLayout(new BorderLayout());
        dialog.add(form, BorderLayout.CENTER);
        dialog.add(buttons, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void editSelectedStudent() {
        int row = studentsTable.getSelectedRow();
        if (row < 0) {
            showError("Select a student from the Students table first.");
            return;
        }

        int modelRow = studentsTable.convertRowIndexToModel(row);
        String id = String.valueOf(studentsTable.getModel().getValueAt(modelRow, 0));

        try {
            showStudentDialog(library.findStudent(id));
        } catch (ValidationException e) {
            showError(e.getMessage());
        }
    }

    private void deleteSelectedStudent() {
        int row = studentsTable.getSelectedRow();
        if (row < 0) {
            showError("Select a student from the Students table first.");
            return;
        }

        int modelRow = studentsTable.convertRowIndexToModel(row);
        String id = String.valueOf(studentsTable.getModel().getValueAt(modelRow, 0));

        if (confirm("Delete student " + id + "?")) {
            try {
                library.deleteStudent(id);
                log("Student deleted: " + id);
                refreshAll();
            } catch (ValidationException e) {
                showError(e.getMessage());
            }
        }
    }

    // -------------------- ISSUE / RETURN --------------------

    private void issueBookDialog() {
        JTextField bookId = new JTextField();
        JTextField studentId = new JTextField();

        JPanel panel = new JPanel(new GridLayout(0, 2, 8, 8));
        panel.add(new JLabel("Book ID:"));
        panel.add(bookId);
        panel.add(new JLabel("Student ID:"));
        panel.add(studentId);

        int result = JOptionPane.showConfirmDialog(
                this, panel, "Issue Book", JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION) {
            try {
                BorrowRecord record = library.issueBook(bookId.getText().trim(), studentId.getText().trim());
                log("Book issued: " + record.getBookId() + " to " + record.getStudentId()
                        + " | Due: " + record.getDueDate().format(dateFormat));
                refreshAll();
                tabs.setSelectedIndex(2);
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        }
    }

    private void returnBookDialog() {
        JTextField bookId = new JTextField();

        JPanel panel = new JPanel(new GridLayout(1, 2, 8, 8));
        panel.add(new JLabel("Book ID:"));
        panel.add(bookId);

        int result = JOptionPane.showConfirmDialog(
                this, panel, "Return Book", JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION) {
            try {
                BorrowRecord record = library.returnBook(bookId.getText().trim());
                double fine = record.calculateFine(java.time.LocalDate.now());
                log(String.format("Book returned: %s | Fine: Rs. %.2f", record.getBookId(), fine));
                refreshAll();
                tabs.setSelectedIndex(2);
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        }
    }

    // -------------------- SEARCH / SORT --------------------

    private void searchBooks() {
        String query = bookSearchField.getText().trim();

        if (query.isEmpty()) {
            refreshBookTable(library.getBooks());
            log("Search cleared. Showing all books.");
            return;
        }

        List<Book> result = library.searchBooks(query);
        refreshBookTable(result);
        log("Search \"" + query + "\" returned " + result.size() + " book(s).");
    }

    private void sortBooks() {
        String field = String.valueOf(sortCombo.getSelectedItem());
        List<Book> sorted = library.getBooksSortedBy(field);
        refreshBookTable(sorted);
        log("Books sorted by " + field + ".");
    }

    private void focusSearch() {
        tabs.setSelectedIndex(0);
        bookSearchField.requestFocusInWindow();
    }

    // -------------------- REPORTS / SPECIAL VIEWS --------------------

    private void showActiveBorrowRecords() {
        List<BorrowRecord> active = library.getBorrowingHistory().stream()
                .filter(BorrowRecord::isActive)
                .toList();
        refreshBorrowTable(active);
        tabs.setSelectedIndex(2);
        log("Showing " + active.size() + " active borrowing record(s).");
    }

    private void showBorrowingHistory() {
        refreshBorrowTable(library.getBorrowingHistory());
        tabs.setSelectedIndex(2);
        log("Borrowing history displayed.");
    }

    private void recommendationDialog() {
        JComboBox<StudentItem> combo = new JComboBox<>();
        for (Student student : library.getStudents()) {
            combo.addItem(new StudentItem(student));
        }

        JPanel panel = new JPanel(new BorderLayout(8, 8));
        panel.add(new JLabel("Select student:"), BorderLayout.WEST);
        panel.add(combo, BorderLayout.CENTER);

        int result = JOptionPane.showConfirmDialog(
                this, panel, "Book Recommendations",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION && combo.getSelectedItem() != null) {
            StudentItem selected = (StudentItem) combo.getSelectedItem();

            try {
                List<Book> recommendations = library.recommendForStudent(selected.student.getId());
                refreshRecommendationTable(recommendations);
                tabs.setSelectedIndex(3);
                log("Generated " + recommendations.size()
                        + " recommendation(s) for " + selected.student.getName() + ".");
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        }
    }

    private void fineDialog() {
        JComboBox<StudentItem> combo = new JComboBox<>();
        for (Student student : library.getStudents()) {
            combo.addItem(new StudentItem(student));
        }

        int result = JOptionPane.showConfirmDialog(
                this, combo, "Fine Calculation - Select Student",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION && combo.getSelectedItem() != null) {
            StudentItem selected = (StudentItem) combo.getSelectedItem();
            try {
                double fine = library.calculateStudentFine(selected.student.getId());
                JOptionPane.showMessageDialog(
                        this,
                        String.format("Student: %s%nCurrent fine: Rs. %.2f",
                                selected.student.getName(), fine),
                        "Fine Calculation",
                        JOptionPane.INFORMATION_MESSAGE
                );
                log(String.format("Fine checked for %s: Rs. %.2f", selected.student.getId(), fine));
            } catch (ValidationException ex) {
                showError(ex.getMessage());
            }
        }
    }

    private void showReport() {
        JTextArea report = new JTextArea(library.generateReport());
        report.setFont(Theme.MONO_FONT);
        report.setEditable(false);
        report.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));

        JScrollPane scroll = new JScrollPane(report);
        scroll.setPreferredSize(new Dimension(620, 400));

        JOptionPane.showMessageDialog(this, scroll, "Library Report", JOptionPane.INFORMATION_MESSAGE);
        log("Library report generated.");
    }

    // -------------------- HELPERS --------------------

    private void addFormRow(JPanel panel, int row, String label, JTextField field) {
        GridBagConstraints left = new GridBagConstraints();
        left.gridx = 0;
        left.gridy = row;
        left.insets = new Insets(7, 5, 7, 8);
        left.anchor = GridBagConstraints.LINE_END;

        GridBagConstraints right = new GridBagConstraints();
        right.gridx = 1;
        right.gridy = row;
        right.weightx = 1;
        right.fill = GridBagConstraints.HORIZONTAL;
        right.insets = new Insets(7, 5, 7, 5);

        panel.add(new JLabel(label), left);
        panel.add(field, right);
    }

    private boolean confirm(String message) {
        return JOptionPane.showConfirmDialog(
                this, message, "Confirm Action",
                JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE) == JOptionPane.YES_OPTION;
    }

    private void showError(String message) {
        log("ERROR: " + message);
        JOptionPane.showMessageDialog(this, message, "Validation / Operation Error",
                JOptionPane.ERROR_MESSAGE);
    }

    private void log(String message) {
        System.out.println(message);
        updateStatus();
    }

    private void updateStatus() {
        statusLabel.setText(
                "Books: " + library.getTotalBooks()
                        + " | Available: " + library.getAvailableBooks()
                        + " | Issued: " + library.getIssuedBooks()
                        + " | Students: " + library.getTotalStudents()
                        + " | Active issues: " + library.getActiveBorrowCount()
        );
    }

    private static class StudentItem {
        private final Student student;

        StudentItem(Student student) {
            this.student = student;
        }

        @Override
        public String toString() {
            return student.getId() + " - " + student.getName();
        }
    }
}
