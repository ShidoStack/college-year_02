package smartlibrary;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import smartlibrary.ui.LibraryFrame;

/**
 * Application entry point.
 */
public class Main {
    public static void main(String[] args) {
        // Use the operating system's look where possible, while the application
        // still controls the important colors/layout of the main window.
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // Swing can safely continue with its default look and feel.
        }

        SwingUtilities.invokeLater(() -> {
            LibraryFrame frame = new LibraryFrame();
            frame.setVisible(true);
        });
    }
}
