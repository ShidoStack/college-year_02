package smartlibrary.ui;

import java.awt.Color;
import java.awt.Font;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.border.Border;

/**
 * Centralized visual constants so the Swing interface remains consistent.
 */
public final class Theme {
    private Theme() {}

    public static final Color HEADER = new Color(45, 133, 190);
    public static final Color SIDEBAR = new Color(45, 67, 84);
    public static final Color BUTTON = new Color(83, 121, 151);
    public static final Color BUTTON_HOVER = new Color(100, 143, 177);
    public static final Color PANEL = new Color(246, 248, 250);
    public static final Color BORDER = new Color(190, 198, 205);
    public static final Color TEXT = new Color(35, 43, 50);
    public static final Color MUTED = new Color(108, 121, 132);
    public static final Color TABLE_HEADER = new Color(205, 211, 215);

    public static final Font TITLE_FONT = new Font("SansSerif", Font.BOLD, 25);
    public static final Font SECTION_FONT = new Font("SansSerif", Font.BOLD, 15);
    public static final Font NORMAL_FONT = new Font("SansSerif", Font.PLAIN, 13);
    public static final Font BUTTON_FONT = new Font("SansSerif", Font.BOLD, 13);
    public static final Font MONO_FONT = new Font("Monospaced", Font.PLAIN, 13);

    public static Border panelBorder() {
        return BorderFactory.createLineBorder(BORDER);
    }

    public static void styleButton(JButton button) {
        button.setFont(BUTTON_FONT);
        button.setForeground(Color.WHITE);
        button.setBackground(BUTTON);
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(150, 170, 185)),
                BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));
        button.setOpaque(true);
    }

    public static JLabel sectionLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(SECTION_FONT);
        label.setForeground(TEXT);
        return label;
    }
}
