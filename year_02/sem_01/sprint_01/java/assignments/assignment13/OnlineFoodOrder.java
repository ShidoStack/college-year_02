import java.util.Scanner;

public class OnlineFoodOrder {

    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter Customer Name: ");
        String name = input.nextLine();

        System.out.print("Enter Item Name: ");
        String item = input.nextLine();

        System.out.print("Enter Quantity: ");
        int quantity = input.nextInt();

        System.out.print("Enter Price per Item: ₹");
        double price = input.nextDouble();

        Order order = new Order(name, item, quantity, price);

        order.calculateBill();

        input.close();
    }
}

class Order {

    private String customerName;
    private String item;
    private int quantity;
    private double price;

    public Order(String customerName, String item, int quantity, double price) {

        this.customerName = customerName;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }

    public void calculateBill() {

        double subtotal = quantity * price;
        double discount = 0.0;

        if (subtotal > 1000) {
            discount = subtotal * 0.05;
        }

        double deliveryFee = 50.0;
        double finalAmount = subtotal - discount + deliveryFee;

        System.out.printf("Subtotal ₹%.0f; Discount ₹%.2f; Delivery ₹%.0f; Final ₹%.2f\n",
                          subtotal, discount, deliveryFee, finalAmount);
    }
}