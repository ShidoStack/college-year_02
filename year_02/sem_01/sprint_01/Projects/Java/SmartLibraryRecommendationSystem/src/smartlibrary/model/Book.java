package smartlibrary.model;

import java.util.Arrays;

/**
 * Represents a book in the library.
 */
public class Book {
    private final String id;
    private String title;
    private String author;
    private String category;
    private int year;
    private boolean available;
    private final String[] tags;

    /**
     * Array is deliberately used here because the case study requires
     * book categories/tags to demonstrate the Java Array concept.
     */
    public Book(String id, String title, String author, String category,
                int year, String[] tags) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.year = year;
        this.tags = tags == null ? new String[0] : Arrays.copyOf(tags, tags.length);
        this.available = true;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getCategory() { return category; }
    public int getYear() { return year; }
    public boolean isAvailable() { return available; }
    public String[] getTags() { return Arrays.copyOf(tags, tags.length); }

    public void setTitle(String title) { this.title = title; }
    public void setAuthor(String author) { this.author = author; }
    public void setCategory(String category) { this.category = category; }
    public void setYear(int year) { this.year = year; }
    public void setAvailable(boolean available) { this.available = available; }

    public String tagsAsText() {
        return String.join(", ", tags);
    }

    @Override
    public String toString() {
        return id + " - " + title;
    }
}
