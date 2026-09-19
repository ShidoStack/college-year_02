import java.util.Scanner;

public class MiniBankingSystem {

    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter Account Number: ");
        String accountNumber = input.nextLine();

        System.out.print("Enter Account Holder Name: ");
        String accountHolder = input.nextLine();

        System.out.print("Enter Initial Balance: ₹");
        double balance = input.nextDouble();

        if (balance < 0) {
            System.out.println("Invalid initial balance.");
            input.close();
            return;
        }

        BankAccount account = new BankAccount(accountNumber, accountHolder, balance);

        int choice;

        do {
            System.out.println("\n--- Banking Menu ---");
            System.out.println("1. Display Account");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Balance Enquiry");
            System.out.println("5. Exit");

            System.out.print("Enter your choice: ");
            choice = input.nextInt();

            if (choice == 1) {
                account.displayAccount();
            }
            else if (choice == 2) {
                System.out.print("Enter deposit amount: ₹");
                double amount = input.nextDouble();
                account.deposit(amount);
            }
            else if (choice == 3) {
                System.out.print("Enter withdrawal amount: ₹");
                double amount = input.nextDouble();
                account.withdraw(amount);
            }
            else if (choice == 4) {
                account.checkBalance();
            }
            else if (choice == 5) {
                System.out.println("Thank you for using the banking system.");
            }
            else {
                System.out.println("Invalid choice.");
            }

        } while (choice != 5);

        input.close();
    }
}

class BankAccount {

    private String accountNumber;
    private String accountHolder;
    private double balance;

    public BankAccount(String accountNumber, String accountHolder, double balance) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }

    public void displayAccount() {
        System.out.println("\nAccount Number: " + accountNumber);
        System.out.println("Account Holder: " + accountHolder);
        System.out.printf("Balance: ₹%.2f\n", balance);
    }

    public void deposit(double amount) {

        if (amount <= 0) {
            System.out.println("Invalid deposit amount.");
        }
        else {
            balance = balance + amount;
            System.out.printf("₹%.2f deposited successfully.\n", amount);
            System.out.printf("New Balance: ₹%.2f\n", balance);
        }
    }

    public void withdraw(double amount) {

        if (amount <= 0) {
            System.out.println("Invalid withdrawal amount.");
        }
        else if (amount > balance) {
            System.out.println("Insufficient balance.");
        }
        else {
            balance = balance - amount;
            System.out.printf("₹%.2f withdrawn successfully.\n", amount);
            System.out.printf("Remaining Balance: ₹%.2f\n", balance);
        }
    }

    public void checkBalance() {
        System.out.printf("Current Balance: ₹%.2f\n", balance);
    }
}