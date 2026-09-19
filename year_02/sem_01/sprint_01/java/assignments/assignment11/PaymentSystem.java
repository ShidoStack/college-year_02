import java.util.Scanner;

public class PaymentSystem {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Payment Type (UPI/CreditCard/CashOnDelivery): ");
        String type = input.next();
        
        System.out.print("Enter Amount: ₹");
        double amount = input.nextDouble();
        
        Payment paymentMethod = null;
        
        if (type.equalsIgnoreCase("UPI")) {
            paymentMethod = new UPI();
        }
        else if (type.equalsIgnoreCase("CreditCard")) {
            paymentMethod = new CreditCard();
        }
        else if (type.equalsIgnoreCase("CashOnDelivery")) {
            paymentMethod = new CashOnDelivery();
        }
        else {
            System.out.println("Invalid payment type.");
            input.close();
            return;
        }
        
        paymentMethod.pay(amount);
        
        input.close();
    }
}

interface Payment {
    void pay(double amount);
}

class UPI implements Payment {
    
    @Override
    public void pay(double amount) {
        System.out.printf("₹%.0f paid successfully using UPI.\n", amount);
    }
}

class CreditCard implements Payment {
    
    @Override
    public void pay(double amount) {
        System.out.printf("₹%.0f paid successfully using CreditCard.\n", amount);
    }
}

class CashOnDelivery implements Payment {
    
    @Override
    public void pay(double amount) {
        System.out.printf("₹%.0f will be paid while receiving delivery as opted for CashOnDelivery.\n", amount);
    }
}
