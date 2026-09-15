// Wap to take all datatypes input and add validation for each datatype.

import java.util.Scanner;

public class typecastingPractice {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter an integer: ");
        while (!sc.hasNextInt()) {
            System.out.println("Invalid input. Please enter an integer.");
            sc.next();
        }
        int intValue = sc.nextInt();

        System.out.print("Enter a double: ");
        while (!sc.hasNextDouble()) {
            System.out.println("Invalid input. Please enter a double.");
            sc.next();
        }
        double doubleValue = sc.nextDouble();

        System.out.print("Enter a character: ");
        char charValue = sc.next().charAt(0);

        System.out.print("Enter a string: ");
        String stringValue = sc.next();

        System.out.println("\nYou entered:");
        System.out.println("Integer: " + intValue);
        System.out.println("Double: " + doubleValue);
        System.out.println("Character: " + charValue);
        System.out.println("String: " + stringValue);

        sc.close();
    }
}