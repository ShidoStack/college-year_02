//Ek supermarket hai usko uska bill calculate karna hai alag alag items ke liye..
//if customer buys one item calculate the bill using the price of the item
//if customer buys multiple quantities of one item calculate price * quantity
//if customer buys multiple items calculate price * quantity + tax


import java.util.Scanner;

public class practiceSum {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.println(" ");

        System.out.println("SUPERMARKET BILLING SYSTEM ");

        System.out.print("Enter number of different items: ");
        int n = sc.nextInt();

        double subtotal = 0;

        for (int i = 1; i <= n; i++) {

            System.out.println("\nItem " + i);

            System.out.print("Enter item name: ");
            String itemName = sc.next();

            System.out.print("Enter price of item: ");
            double price = sc.nextDouble();

            System.out.print("Enter quantity: ");
            int quantity = sc.nextInt();

            double itemTotal = price * quantity;

            System.out.println("Item: " + itemName);
            System.out.println("Price: " + price);
            System.out.println("Quantity: " + quantity);
            System.out.println("Item Total: " + itemTotal);

            subtotal = subtotal + itemTotal;
        }

        // Calculate tax
        double taxRate = 18;
        double tax = subtotal * taxRate / 100;

        // Calculate final bill
        double finalBill = subtotal + tax;

        System.out.println("\n BILL : ");
        System.out.println("Subtotal: " + subtotal);
        System.out.println("Tax (18%): " + tax);
        System.out.println("Final Bill: " + finalBill);

        sc.close();
    }
}