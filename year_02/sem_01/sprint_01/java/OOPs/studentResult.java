import java.util.Scanner;

public class studentResult {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int[] marks = new int[5];

        System.out.println("Enter marks for 5 subjects:");

        for (int i = 0; i < 5; i++) {
            marks[i] = sc.nextInt();
        }

        int total = 0;
        int highest = marks[0];
        int lowest = marks[0];

        for (int mark : marks) {
            total += mark;

            if (mark > highest) {
                highest = mark;
            }

            if (mark < lowest) {
                lowest = mark;
            }
        }

        double average = total / 5.0;

        System.out.println("\n--- Student Result ---");
        System.out.println("Java: " + marks[0]);
        System.out.println("Database: " + marks[1]);
        System.out.println("Computer Networking: " + marks[2]);
        System.out.println("OS: " + marks[3]);
        System.out.println("Mathematics: " + marks[4]);

        System.out.println("Total Marks: " + total);
        System.out.println("Average: " + average);
        System.out.println("Highest Score: " + highest);
        System.out.println("Lowest Score: " + lowest);

        sc.close();
    }
}