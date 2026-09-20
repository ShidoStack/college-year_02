public class StudentResult {

    public static void main(String[] args) {

        int[] marks = {85, 72, 91, 68, 80};

        int total = 0;
        int highest = marks[0];
        int lowest = marks[0];
        int search = 68;
        boolean found = false;

        for (int i = 0; i < marks.length; i++) {

            System.out.println("Subject " + (i + 1) + ": " + marks[i]);

            total = total + marks[i];

            if (marks[i] > highest) {
                highest = marks[i];
            }

            if (marks[i] < lowest) {
                lowest = marks[i];
            }

            if (marks[i] == search) {
                System.out.println("Search Index for number: " + search + " is at index: " + i);
                found = true;
                break;
            }
        }

        double average = total / 5.0;

        System.out.println("Total: " + total);
        System.out.println("Average: " + average);
        System.out.println("Highest: " + highest);
        System.out.println("Lowest: " + lowest);

        if (!found) {
            System.out.println("Search Index Not found");
        }
    }
}
