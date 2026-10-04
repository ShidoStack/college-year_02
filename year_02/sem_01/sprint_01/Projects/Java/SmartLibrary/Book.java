public class Book {
    private String id;
    private String title;
    private String author;
    private int year;
    private String[] categories;
    private boolean isAvailable;

    public Book(String id, String title, String author, int year, String[] categories) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.categories = categories;
        this.isAvailable = true;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public int getYear() { return year; }
    public String[] getCategories() { return categories; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    
    @Override
    public String toString() {
        return title + " by " + author + " (" + year + ")";
    }
}
