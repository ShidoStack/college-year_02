package smartlibrary.util;

/**
 * Custom checked exception for invalid user input/business rules.
 */
public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}
