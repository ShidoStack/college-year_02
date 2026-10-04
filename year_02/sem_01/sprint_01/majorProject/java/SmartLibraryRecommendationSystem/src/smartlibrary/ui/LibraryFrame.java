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

    private final JTextArea console = new JTextArea();
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
        add(createSidebar(), BorderLayout.WEST);
        add(createMainArea(), BorderLayout.CENTER);
    }

    // -------------------- HEADER --------------------

    private JPanel createHeader() {
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(Theme.HEADER);
        header.setBorder(BorderFactory.createEmptyBorder(14, 20, 14, 20));

        JLabel title = new JLabel("Smart Library Recommendation System");
        title.setForeground(Color.WHITE);
        title.setFont(Theme.TITLE_FONT);

        JLabel subtitle = new JLabel("Library management • borrowing • search • sorting • recommendations");
        subtitle.setForeground(new Color(225, 239, 249));
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 12));

        JPanel text = new JPanel();
        text.setOpaque(false);
        text.setLayout(new javax.swing.BoxLayout(text, javax.swing.BoxLayout.Y_AXIS));

        text.add(title);
        text.add(subtitle);

        header.add(text, BorderLayout.WEST);
        return header;
    }

    // -------------------- SIDEBAR --------------------

    private JPanel createSidebar() {
        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setBackground(Theme.SIDEBAR);
        sidebar.setPreferredSize(new Dimension(230, 0));
        sidebar.setBorder(BorderFactory.createEmptyBorder(18, 12, 18, 12));

        JPanel actions = new JPanel();
        actions.setOpaque(false);
        actions.setLayout(new GridLayout(0, 1, 0, 9));

        JLabel actionTitle = new JLabel("ACTIONS");
        actionTitle.setForeground(new Color(177, 192, 202));
        actionTitle.setFont(new Font("SansSerif", Font.BOLD, 12));
        actions.add(actionTitle);

        addSidebarButton(actions, "Add Book", e -> showBookDialog(null));
        addSidebarButton(actions, "Edit Selected Book", e -> editSelectedBook());
        addSidebarButton(actions, "Delete Selected Book", e -> deleteSelectedBook());

        addSidebarButton(actions, "Add Student", e -> showStudentDialog(null));
        addSidebarButton(actions, "Edit Selected Student", e -> editSelectedStudent());
        addSidebarButton(actions, "Delete Selected Student", e -> deleteSelectedStudent());

        addSidebarButton(actions, "Issue Book", e -> issueBookDialog());
        addSidebarButton(actions, "Return Book", e -> returnBookDialog());

        JLabel spacer = new JLabel();
        spacer.setPreferredSize(new Dimension(1, 12));
        actions.add(spacer);

        JLabel reports = new JLabel("REPORTS & VIEWS");
        reports.setForeground(new Color(177, 192, 202));
        reports.setFont(new Font("SansSerif", Font.BOLD, 12));
        actions.add(reports);

        addSidebarButton(actions, "Search Books", e -> focusSearch());
        addSidebarButton(actions, "Sort Books", e -> sortBooks());
        addSidebarButton(actions, "Recommendations", e -> recommendationDialog());
        addSidebarButton(actions, "Borrowing History", e -> showBorrowingHistory());
        addSidebarButton(actions, "Fine Calculation", e -> fineDialog());
        addSidebarButton(actions, "Generate Report", e -> showReport());
        addSidebarButton(actions, "Refresh All", e -> {
            refreshAll();
            log("All tables refreshed.");
        });

        sidebar.add(actions, BorderLayout.NORTH);

        JLabel footer = new JLabel(
                "<html><center>Java Swing<br>OOP • Collections • CRUD<br>Search • Sort • Validation</center></html>",
                SwingConstants.CENTER);
        footer.setForeground(new Color(173, 188, 198));
        footer.setFont(new Font("SansSerif", Font.PLAIN, 11));
        sidebar.add(footer, BorderLayout.SOUTH);

        return sidebar;
    }

    private void addSidebarButton(JPanel panel, String text, java.awt.event.ActionListener listener) {
        JButton button = new JButton(text);
        Theme.styleButton(button);
        button.setPreferredSize(new Dimension(205, 40));
        button.addActionListener(listener);
        panel.add(button);
    }

    // -------------------- MAIN AREA --------------------

    private JPanel createMainArea() {
        JPanel main = new JPanel(new BorderLayout(0, 10));
        main.setBackground(Theme.PANEL);
        main.setBorder(BorderFactory.createEmptyBorder(10, 12, 10, 12));

        tabs.addTab("Books", createBooksTab());
        tabs.addTab("Students", createStudentsTab());
        tabs.addTab("Borrow Records", createBorrowTab());
        tabs.addTab("Recommendations", createRecommendationTab());

        main.add(tabs, BorderLayout.CENTER);
        main.add(createConsolePanel(), BorderLayout.SOUTH);

        return main;
    }

    private JPanel createBooksTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Color.WHITE);
        panel.setBorder(Theme.panelBorder());

        JPanel toolbar = new JPanel(new BorderLayout(8, 0));
        toolbar.setBorder(BorderFactory.createEmptyBorder(8, 8, 0, 8));
        toolbar.setBackground(Color.WHITE);

        JPanel searchPanel = new JPanel(new BorderLayout(6, 0));
        searchPanel.setOpaque(false);
        JLabel searchLabel = new JLabel("Search:");
        searchLabel.setFont(Theme.SECTION_FONT);
        searchPanel.add(searchLabel, BorderLayout.WEST);
        searchPanel.add(bookSearchField, BorderLayout.CENTER);

        JButton searchButton = new JButton("Search");
        Theme.styleButton(searchButton);
        searchButton.addActionListener(e -> searchBooks());
        searchPanel.add(searchButton, BorderLayout.EAST);

        JPanel sortPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 6, 0));
        sortPanel.setOpaque(false);
        sortPanel.add(new JLabel("Sort by:"));
        sortPanel.add(sortCombo);

        JButton sortButton = new JButton("Apply");
        Theme.styleButton(sortButton);
        sortButton.addActionListener(e -> sortBooks());
        sortPanel.add(sortButton);

        toolbar.add(searchPanel, BorderLayout.CENTER);
        toolbar.add(sortPanel, BorderLayout.EAST);

        panel.add(toolbar, BorderLayout.NORTH);
        panel.add(new JScrollPane(booksTable), BorderLayout.CENTER);

        return panel;
    }

    private JPanel createStudentsTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Color.WHITE);
        panel.setBorder(Theme.panelBorder());

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        top.setBackground(Color.WHITE);
        JLabel info = new JLabel("Student records • use the sidebar for Add / Edit / Delete");
        info.setForeground(Theme.MUTED);
        top.add(info);

        panel.add(top, BorderLayout.NORTH);
        panel.add(new JScrollPane(studentsTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createBorrowTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Color.WHITE);
        panel.setBorder(Theme.panelBorder());

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        top.setBackground(Color.WHITE);

        JButton activeOnly = new JButton("Show Active Issues");
        Theme.styleButton(activeOnly);
        activeOnly.addActionListener(e -> showActiveBorrowRecords());

        JButton all = new JButton("Show All History");
        Theme.styleButton(all);
        all.addActionListener(e -> refreshBorrowTable(library.getBorrowingHistory()));

        top.add(new JLabel("Borrowing history:"));
        top.add(activeOnly);
        top.add(all);

        panel.add(top, BorderLayout.NORTH);
        panel.add(new JScrollPane(borrowTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createRecommendationTab() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(Color.WHITE);
        panel.setBorder(Theme.panelBorder());

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        top.setBackground(Color.WHITE);

        JButton recommend = new JButton("Get Recommendations");
        Theme.styleButton(recommend);
        recommend.addActionListener(e -> recommendationDialog());

        JLabel note = new JLabel(
                "Recommendations use a simple preference score from the student's borrowing categories/tags.");
        note.setForeground(Theme.MUTED);

        top.add(recommend);
        top.add(note);

        panel.add(top, BorderLayout.NORTH);
        panel.add(new JScrollPane(recommendationTable), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createConsolePanel() {
        JPanel wrapper = new JPanel(new BorderLayout(0, 4));
        wrapper.setBackground(Theme.PANEL);
        wrapper.setPreferredSize(new Dimension(0, 165));

        JLabel title = new JLabel("System Console");
        title.setFont(Theme.SECTION_FONT);
        title.setForeground(new Color(58, 78, 99));

        console.setEditable(false);
        console.setFont(Theme.MONO_FONT);
        console.setBackground(new Color(238, 242, 245));
        console.setForeground(new Color(49, 64, 78));
        console.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        console.setLineWrap(true);
        console.setWrapStyleWord(true);

        JPanel consoleBorder = new JPanel(new BorderLayout());
        consoleBorder.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(176, 184, 191)),
                BorderFactory.createLineBorder(new Color(220, 224, 228))
        ));
        consoleBorder.add(new JScrollPane(console), BorderLayout.CENTER);

        wrapper.add(title, BorderLayout.NORTH);
        wrapper.add(consoleBorder, BorderLayout.CENTER);
        return wrapper;
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
        console.append(message + "\n");
        console.setCaretPosition(console.getDocument().getLength());
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
