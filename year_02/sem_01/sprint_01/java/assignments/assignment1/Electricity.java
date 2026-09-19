import java.util.Scanner;

public class Electricity {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter electricity units: ");
        double electricityUnits = input.nextDouble();

        double totalAmount;

        if (electricityUnits <= 100) {
            totalAmount = electricityUnits * 2;
        }
        else if (electricityUnits <= 200) {
            totalAmount = (100 * 2) + ((electricityUnits - 100) * 3);
        }
        else {
            totalAmount = (100 * 2) + (100 * 3)
                        + ((electricityUnits - 200) * 5);
        }

        System.out.printf("Total Electricity Bill: ₹%.2f", totalAmount);

        input.close();
    }
}