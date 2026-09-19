import java.util.Scanner;

public class ATM {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Account Balance: ₹");
        double balance = input.nextDouble();
        
        System.out.print("Enter Withdrawal Amount: ₹");
        double withdrawalAmount = input.nextDouble();
        
        if (withdrawalAmount > 0 && withdrawalAmount % 100 == 0 && withdrawalAmount <= balance) {
            balance -= withdrawalAmount;
            
            System.out.println("Withdrawal Successful");
            System.out.printf("Remaining Balance: ₹%.0f\n", balance);
        }
        else {
            if (withdrawalAmount <= 0) {
                System.out.println("Withdrawal Failed: Amount must be positive.");
            }
            else if (withdrawalAmount % 100 != 0) {
                System.out.println("Withdrawal Failed: Amount must be a multiple of ₹100.");
            }
            else {
                System.out.println("Withdrawal Failed: Insufficient balance.");
            }
        }
        
        input.close();
    }
}
